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
import { findNextOpenTaskIndex, isOpenTask, moveTaskToEnd, sortTasksByLocation } from './lib';

type Callback = (response: { errorMessage?: string }) => void;

/** What to do with a list once its session is started: pick its tasks, or stage what was picked */
export type SessionStart = 'PICK' | 'STAGE';

type ReplenishmentContextType = {
  /** The replenishment list being worked on */
  currentList?: ReplenishmentList;
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
  loadListTasks: (callback?: Callback) => void;
  goToTask: (index: number) => void;
  /** Moves the current task to the end of the sequence and shows the next one to pick */
  skipCurrentTask: () => void;
  pickCurrentTask: (outboundContainerId: string, callback: Callback) => void;
  shortPickTask: (
    outboundContainerId: string | null,
    parsedQuantityPicked: number,
    callback: Callback,
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
          setAllTasks(sortTasksByLocation(openTasks));
          setListTasks([]);
          setCurrentTaskIndex(0);
          resolve(openTasks.length > 0 ? 'PICK' : 'STAGE');
        })
      );
    });

  const loadListTasks = (callback?: Callback) => {
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

  const shortPickTask = (
    outboundContainerId: string | null,
    parsedQuantityPicked: number,
    callback: Callback,
    reasonCodeName?: string
  ) => {
    if (!currentTask) {
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
          updateCurrentTask(response?.data, {
            quantityPicked: (currentTask.quantityPicked || 0) + parsedQuantityPicked,
            reasonCode: reasonCodeName ?? null,
            status: ReplenishmentTaskStatus.PICKED
          });
          callback({});
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
    setAllTasks([]);
    setListTasks([]);
    setCurrentTaskIndex(0);
  };

  return (
    <ReplenishmentContext.Provider
      value={{
        currentList,
        allTasks,
        tasksCount,
        openTasksCount,
        currentTaskIndex,
        currentTask,
        listTasks,
        startSession,
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
