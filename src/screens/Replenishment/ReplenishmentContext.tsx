/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DUMMY_REPLENISHMENT_TASKS } from './mock-data';
import { ReplenishmentTask } from './types';

type ReplenishmentContextType = {
  allTasks: ReplenishmentTask[];
  tasksCount: number;
  currentTask?: ReplenishmentTask;
  currentTaskIndex: number;
  startReplenishment: (callback: (response: { errorMessage?: string }) => void) => void;
  goToNextTask: () => void;
  pickCurrentTask: (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => void;
  shortPickTask: (
    outboundContainerId: string,
    parsedQuantityPicked: number,
    callback: (response: { errorMessage?: string }) => void,
    reasonCodeName?: string
  ) => void;
  revalidateCurrentTask: (callback: (revalidatedTask?: ReplenishmentTask) => void) => void;
  revalidateTasksForOrder: (orderId: string, callback: () => void) => void;
  dropCurrentTaskAtStagingLocation: (
    task: ReplenishmentTask,
    callback: (response: { errorMessage?: string }) => void
  ) => void;
  resetReplenishmentSession: () => void;
};

const ReplenishmentContext = createContext<ReplenishmentContextType | undefined>(undefined);

export function ReplenishmentProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  // @ts-ignore
  const [allTasks, setAllTasks] = useState<ReplenishmentTask[]>(DUMMY_REPLENISHMENT_TASKS);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const tasksCount = allTasks.length;
  const currentTask = DUMMY_REPLENISHMENT_TASKS[0];
  // const currentTask = tasksCount > 0 ? allTasks[currentTaskIndex] : undefined;

  const startReplenishment = (callback: (response: { errorMessage?: string }) => void) => {
    // TODO: Implement the logic for starting the replenishment process
    // dispatch(startReplenishmentProcess(currentTask.id, callback));
  };

  const pickCurrentTask = (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => {
    // TODO: Implement the logic for picking the current task
    // dispatch(pickCurrentTask(currentTask.id, outboundContainerId, callback));
  };

  const shortPickTask = (
    outboundContainerId: string,
    parsedQuantityPicked: number,
    callback: (response: { errorMessage?: string }) => void,
    reasonCodeName?: string
  ) => {
    // TODO: Implement the logic for short picking the current task
    // dispatch(shortPickTask(currentTask.id, outboundContainerId, parsedQuantityPicked, callback, reasonCodeName));
  };

  const revalidateCurrentTask = (callback: (revalidatedTask?: ReplenishmentTask) => void) => {
    // TODO: Implement the logic for revalidating the current task
    // dispatch(getTaskById(currentTask.id, ({ response }) => {
    // if (response.errorCode || !response.data) {
    //   Alert.alert('Failed To Revalidate', 'Could not revalidate the current task.');
    //   return;
    // }
    //
    // const revalidatedTask = response.data;
    // setAllTasks((prevTasks) => prevTasks.map((task, index) => (index === currentTaskIndex ? revalidatedTask : task)));
    // callback?.(revalidatedTask);
    // });
  };

  const revalidateTasksForOrder = (orderId: string, callback: () => void) => {
    // TODO: Implement the logic for revalidating all tasks for the order
    // dispatch(revalidateTasksForOrderAction(orderId, ({ response }) => {
    // TODO: Handle response and update tasks accordingly
    //}));
  };

  const dropCurrentTaskAtStagingLocation = (
    task: ReplenishmentTask,
    callback: (response: { errorMessage?: string }) => void
  ) => {
    // TODO: Implement the logic for dropping the current task at the staging location
    // dispatch(dropTaskAtStagingLocation(task.outboundContainer.id, task.stagingLocation.id, callback));
  };

  const resetReplenishmentSession = () => {
    setAllTasks([]);
    setCurrentTaskIndex(0);
  };

  const goToNextTask = () => {
    setCurrentTaskIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <ReplenishmentContext.Provider
      value={{
        allTasks,
        tasksCount,
        currentTaskIndex,
        // @ts-ignore
        currentTask,
        startReplenishment,
        goToNextTask,
        pickCurrentTask,
        shortPickTask,
        revalidateCurrentTask,
        revalidateTasksForOrder,
        dropCurrentTaskAtStagingLocation,
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
