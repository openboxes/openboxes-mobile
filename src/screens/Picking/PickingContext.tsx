import * as React from 'react';
import { PickTask, PickType } from './types';

// --- Mock Data Setup ---
// We define it here to simulate the "Start Session" response.
const MOCKED_PICK_TASKS: PickTask[] = [
  {
    id: 'task-001',
    // @ts-ignore
    product: { productCode: 'PROD-001', name: 'Mocked Product Number 1' },
    // @ts-ignore
    destination: { name: 'Aisle 1, Shelf A' },
    // @ts-ignore
    outboundContainer: { id: 'OUTBOUND-CONTAINER-0001', name: 'Outbound Container 1' },
    quantityToPick: 10,
    status: 'PENDING'
  },
  {
    id: 'task-002',
    // @ts-ignore
    product: { productCode: 'PROD-002', name: 'Mocked Product Number 2' },
    // @ts-ignore
    destination: { name: 'Aisle 3, Shelf B' },
    outboundContainer: undefined,
    quantityToPick: 5,
    status: 'PENDING'
  }
];

type PickingContextType = {
  /** The list of all tasks for this session */
  tasks: PickTask[];

  /** The index of the task currently being worked on */
  currentTaskIndex: number;

  /** The derived object for the active task */
  currentTask: PickTask | undefined;

  /** Total number of tasks in the session */
  allTasksCount: number;

  /**
   * Initializes the picking session.
   * Fetches tasks based on criteria (mocked for now).
   */
  startSession: (pickType: PickType, quantityToGroup: number) => Promise<void>;

  /**
   * Mark the current task as complete, assign the container,
   * and decide if we move to the next task or finish.
   */
  completeCurrentTask: (outboundContainerId: string) => { isSessionComplete: boolean };

  /** Resets state to initial values */
  resetSession: () => void;

  /** Handle partial pick for the current task */
  handlePartialPick: (pickedQuantity: number) => void;
};

const PickingContext = React.createContext<PickingContextType | undefined>(undefined);

export function PickingProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<PickTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = React.useState<number>(0);
  const currentTask = tasks[currentTaskIndex];
  const allTasksCount = tasks.length;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startSession = async (pickType: PickType, quantityToGroup: number) => {
    // TODO: API Call goes here.
    // const response = await api.getPickTasks(pickType, quantityToGroup);

    // For now, load mocks
    setTasks(MOCKED_PICK_TASKS);
    setCurrentTaskIndex(0);
  };

  const completeCurrentTask = (outboundContainerId: string) => {
    const updatedTasks = [...tasks];

    // 1. Update the specific task with the container info and status
    if (updatedTasks[currentTaskIndex]) {
      updatedTasks[currentTaskIndex] = {
        ...updatedTasks[currentTaskIndex],
        // @ts-ignore
        outboundContainer: {
          id: outboundContainerId,
          name: 'Scanned Container'
        },
        status: 'COMPLETED'
      };
    }

    setTasks(updatedTasks);

    // 2. Check if there are more tasks
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      return { isSessionComplete: false };
    } else {
      return { isSessionComplete: true };
    }
  };

  // 3. Handle partial pick
  const handlePartialPick = async (pickedQuantity: number) => {
    const updatedTasks = [...tasks];

    if (updatedTasks[currentTaskIndex]) {
      updatedTasks[currentTaskIndex] = {
        ...updatedTasks[currentTaskIndex],
        quantityToPick: tasks[currentTaskIndex].quantityToPick - pickedQuantity
      };
      setTasks(updatedTasks);
    }
  };

  const resetSession = () => {
    setTasks([]);
    setCurrentTaskIndex(0);
  };

  return (
    <PickingContext.Provider
      value={{
        tasks,
        currentTaskIndex,
        currentTask,
        allTasksCount,
        startSession,
        completeCurrentTask,
        resetSession,
        handlePartialPick
      }}
    >
      {children}
    </PickingContext.Provider>
  );
}

export function usePickingContext() {
  const context = React.useContext(PickingContext);
  if (!context) {
    throw new Error('usePickingContext must be used within a PickingProvider');
  }
  return context;
}
