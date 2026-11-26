import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { ALL_TASK_STATUSES, LIST_STATUS_PICKED } from '../../apis/replenishment';
import {
  dropReplenishmentContainerAction,
  getReplenishmentTasksAction,
  pickReplenishmentTaskAction,
  shortPickReplenishmentTaskAction,
  startReplenishmentTaskAction
} from '../../redux/actions/replenishment';
import { ReplenishmentList, ReplenishmentTask, ReplenishmentTaskStatus } from '../../types/replenishment';
import {
  appendNewTasks,
  describeReallocatedTasks,
  findNextOpenTaskIndex,
  isOpenTask,
  moveTaskToEnd,
  sortTasksByLocation
} from './lib';

type Callback = (response: { errorMessage?: string }) => void;

/** tasks: the session's tasks after the short pick, with any task created to pick the shortage elsewhere */
type ShortPickCallback = (response: { errorMessage?: string; tasks?: ReplenishmentTask[] }) => void;

/** What to do with a list once its session is started: pick its tasks, or stage what was picked */
export type SessionStart = 'PICK' | 'STAGE';

type ReplenishmentContextType = {
  /** The replenishment list being worked on; undefined in a sequential session */
  currentList?: ReplenishmentList;
  /** Whether the list screen starts sequential sessions (all open tasks of the facility) rather than one list's */
  sequentialMode: boolean;
  setSequentialMode: (sequentialMode: boolean) => void;
  /** Whether the current session goes through the open tasks of all lists, rather than one list's */
  isSequential: boolean;
  /** The tasks to pick in this session, in location sequence; picked ones stay with their new status */
  allTasks: ReplenishmentTask[];
  tasksCount: number;
  /** Tasks of the session still to pick */
  openTasksCount: number;
  currentTask?: ReplenishmentTask;
  currentTaskIndex: number;
  /** All tasks of the list, whatever their status, as last loaded by loadListTasks (for the summary and staging) */
  listTasks: ReplenishmentTask[];
  /**
   * Loads the open tasks of the list in location sequence. Resolves 'STAGE' when none are left but picks wait to be
   * staged, and false (after alerting) when there is nothing to do.
   */
  startSession: (list: ReplenishmentList) => Promise<SessionStart | false>;
  /**
   * Loads the open tasks of all the facility's lists in location sequence. Resolves false (after alerting) when there
   * is nothing to pick.
   */
  startSequentialSession: () => Promise<boolean>;
  loadListTasks: (callback?: Callback) => void;
  goToTask: (index: number) => void;
  /** Moves the current task to the end of the sequence and shows the next one to pick */
  skipCurrentTask: () => void;
  pickCurrentTask: (outboundContainerId: string, callback: Callback) => void;
  shortPickTask: (
    outboundContainerId: string | null,
    parsedQuantityPicked: number,
    callback: ShortPickCallback,
    reasonCodeName?: string
  ) => void;
  /** Stages the picks of the container in the staging location */
  dropContainerAtStagingLocation: (outboundContainerId: string, stagingLocationId: string, callback: Callback) => void;
  resetReplenishmentSession: () => void;
};

const ReplenishmentContext = createContext<ReplenishmentContextType | undefined>(undefined);

export function ReplenishmentProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  const [currentList, setCurrentList] = useState<ReplenishmentList | undefined>(undefined);
  // Not saved: each app start begins in the sequential run of OBLS-408; the "Pick By List" toggle turns on list mode
  const [sequentialMode, setSequentialMode] = useState<boolean>(true);
  const [isSequential, setIsSequential] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<ReplenishmentTask[]>([]);
  const [listTasks, setListTasks] = useState<ReplenishmentTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const tasksCount = allTasks.length;
  const openTasksCount = allTasks.filter(isOpenTask).length;
  const currentTask = currentTaskIndex < tasksCount ? allTasks[currentTaskIndex] : undefined;
  const currentTaskId = currentTask?.id;
  const isCurrentTaskPending = currentTask?.status === ReplenishmentTaskStatus.PENDING;

  // Starts a task when it is shown, like outbound picking: it is assigned to the picker and becomes PICKING. A task
  // started by another picker is refused, and the picker is told so.
  useEffect(() => {
    if (!currentTaskId || !isCurrentTaskPending) {
      return;
    }
    dispatch(
      startReplenishmentTaskAction(currentTaskId, ({ response, errorMessage }) => {
        if (errorMessage) {
          Alert.alert('Unable To Start Task', errorMessage);
          return;
        }
        const startedTask = response?.data;
        setAllTasks((tasks) =>
          tasks.map((task) =>
            task.id === currentTaskId ? startedTask ?? { ...task, status: ReplenishmentTaskStatus.PICKING } : task
          )
        );
      })
    );
  }, [currentTaskId, isCurrentTaskPending, dispatch]);

  const startSession = (list: ReplenishmentList): Promise<SessionStart | false> =>
    new Promise((resolve) => {
      dispatch(
        getReplenishmentTasksAction(list.id, ({ response, errorMessage }) => {
          if (errorMessage || !response) {
            Alert.alert('Error', errorMessage ?? 'Failed to load replenishment tasks.');
            resolve(false);
            return;
          }

          if (response.errorCode) {
            Alert.alert('Error', response.message ?? 'Failed to load replenishment tasks.');
            resolve(false);
            return;
          }

          const openTasks = response.data ?? [];
          if (openTasks.length === 0 && list.status !== LIST_STATUS_PICKED) {
            Alert.alert('No Tasks', `No open replenishment tasks were found for ${list.orderNumber}.`);
            resolve(false);
            return;
          }

          setCurrentList(list);
          setIsSequential(false);
          setAllTasks(sortTasksByLocation(openTasks));
          setListTasks([]);
          setCurrentTaskIndex(0);
          resolve(openTasks.length > 0 ? 'PICK' : 'STAGE');
        })
      );
    });

  const startSequentialSession = (): Promise<boolean> =>
    new Promise((resolve) => {
      dispatch(
        getReplenishmentTasksAction(undefined, ({ response, errorMessage }) => {
          if (errorMessage || !response || response.errorCode) {
            Alert.alert('Error', errorMessage ?? response?.message ?? 'Failed to load replenishment tasks.');
            resolve(false);
            return;
          }

          const openTasks = response.data ?? [];
          if (openTasks.length === 0) {
            Alert.alert('No Tasks', 'No open replenishment tasks were found.');
            resolve(false);
            return;
          }

          setCurrentList(undefined);
          setIsSequential(true);
          setAllTasks(sortTasksByLocation(openTasks));
          setListTasks([]);
          setCurrentTaskIndex(0);
          resolve(true);
        })
      );
    });

  const loadListTasks = (callback?: Callback) => {
    // A sequential session spans lists: its summary and staging are about the tasks of the session, kept up to date
    // after each pick
    if (isSequential) {
      setListTasks(allTasks);
      callback?.({});
      return;
    }
    if (!currentList) {
      callback?.({ errorMessage: 'No current replenishment list.' });
      return;
    }
    dispatch(
      getReplenishmentTasksAction(
        currentList.id,
        ({ response, errorMessage }) => {
          if (errorMessage || !response?.data) {
            callback?.({ errorMessage: errorMessage ?? 'Failed to load replenishment tasks.' });
            return;
          }
          setListTasks(response.data);
          callback?.({});
        },
        ALL_TASK_STATUSES
      )
    );
  };

  const goToTask = (index: number) => {
    setCurrentTaskIndex(index);
  };

  const skipCurrentTask = () => {
    if (openTasksCount <= 1) {
      return;
    }
    const tasks = moveTaskToEnd(allTasks, currentTaskIndex);
    setAllTasks(tasks);
    // Starting from the current index, which now holds the task that followed the skipped one
    setCurrentTaskIndex(Math.max(findNextOpenTaskIndex(tasks, currentTaskIndex - 1), 0));
  };

  /**
   * Replaces the current task by the one returned by the API, or else records the pick on it, so the session shows what
   * was picked
   */
  const updateCurrentTask = (pickedTask: ReplenishmentTask | undefined, fallback: Partial<ReplenishmentTask>) => {
    setAllTasks((tasks) =>
      tasks.map((task, index) => {
        if (index !== currentTaskIndex) {
          return task;
        }
        return pickedTask?.id === task.id ? pickedTask : { ...task, ...fallback };
      })
    );
  };

  const pickCurrentTask = (outboundContainerId: string, callback: Callback) => {
    if (!currentTask) {
      callback({ errorMessage: 'No current replenishment task.' });
      return;
    }
    dispatch(
      pickReplenishmentTaskAction(currentTask.id, outboundContainerId, ({ response, errorMessage }) => {
        if (errorMessage) {
          callback({ errorMessage });
          return;
        }
        updateCurrentTask(response?.data, {
          quantityPicked: currentTask.quantityRequired,
          status: ReplenishmentTaskStatus.PICKED
        });
        callback({});
      })
    );
  };

  /**
   * Shorts the current task. With a reason, the server holds the quantity not found and may create tasks to pick it
   * from other bins: those are loaded into the session, after the tasks it has, and the picker is told.
   */
  const shortPickTask = (
    outboundContainerId: string | null,
    parsedQuantityPicked: number,
    callback: ShortPickCallback,
    reasonCodeName?: string
  ) => {
    if (!currentTask || (!currentList && !isSequential)) {
      callback({ errorMessage: 'No current replenishment task.' });
      return;
    }
    dispatch(
      shortPickReplenishmentTaskAction(
        currentTask.id,
        outboundContainerId,
        parsedQuantityPicked,
        reasonCodeName,
        ({ response, errorMessage }) => {
          if (errorMessage) {
            callback({ errorMessage });
            return;
          }
          const pickedTask = response?.data;
          const tasks = allTasks.map((task, index) => {
            if (index !== currentTaskIndex) {
              return task;
            }
            return pickedTask?.id === task.id
              ? pickedTask
              : {
                  ...task,
                  quantityPicked: (currentTask.quantityPicked || 0) + parsedQuantityPicked,
                  reasonCode: reasonCodeName ?? null,
                  status: ReplenishmentTaskStatus.PICKED
                };
          });

          if (!reasonCodeName) {
            setAllTasks(tasks);
            callback({ tasks });
            return;
          }

          dispatch(
            // In a sequential session, the reload also brings new open tasks of other lists: they join the run
            getReplenishmentTasksAction(currentList?.id, ({ response: openTasksResponse }) => {
              // When the reload fails, the session goes on with the tasks it has
              const tasksWithReallocated = appendNewTasks(tasks, openTasksResponse?.data ?? []);
              const reallocatedTasks = tasksWithReallocated.slice(tasks.length);
              setAllTasks(tasksWithReallocated);
              if (reallocatedTasks.length > 0) {
                Alert.alert(
                  'Inventory On Hold',
                  `The quantity not found was put on hold for investigation. ${describeReallocatedTasks(
                    reallocatedTasks
                  )}.`
                );
              }
              callback({ tasks: tasksWithReallocated });
            })
          );
        }
      )
    );
  };

  const dropContainerAtStagingLocation = (
    outboundContainerId: string,
    stagingLocationId: string,
    callback: Callback
  ) => {
    if (!stagingLocationId) {
      callback({ errorMessage: 'Please scan or enter a staging location.' });
      return;
    }
    dispatch(
      dropReplenishmentContainerAction(outboundContainerId, stagingLocationId, ({ errorMessage }) => {
        callback(errorMessage ? { errorMessage } : {});
      })
    );
  };

  const resetReplenishmentSession = () => {
    setCurrentList(undefined);
    setIsSequential(false);
    setAllTasks([]);
    setListTasks([]);
    setCurrentTaskIndex(0);
  };

  return (
    <ReplenishmentContext.Provider
      value={{
        currentList,
        sequentialMode,
        setSequentialMode,
        isSequential,
        allTasks,
        tasksCount,
        openTasksCount,
        currentTaskIndex,
        currentTask,
        listTasks,
        startSession,
        startSequentialSession,
        loadListTasks,
        goToTask,
        skipCurrentTask,
        pickCurrentTask,
        shortPickTask,
        dropContainerAtStagingLocation,
        resetReplenishmentSession
      }}
    >
      {children}
    </ReplenishmentContext.Provider>
  );
}

export function useReplenishmentContext() {
  const context = useContext(ReplenishmentContext);
  if (!context) {
    throw new Error('useReplenishmentContext must be used within a ReplenishmentProvider');
  }
  return context;
}
