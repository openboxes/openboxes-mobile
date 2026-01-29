import { useCallback, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { getSortationDetailsByBarcode } from '../../redux/actions/products';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { SortationProduct, SortationTask } from '../../types/sortation';

export type SortationState = {
  productBarcode: string;
  quantity: string;
  containerBarcode: string;
  storageLocationBarcode: string;
  loading: boolean;
  currentStep: number;
  isSorted: boolean;
  error: string | null;
  task: SortationTask | null;
};

export type SortationActions = {
  setProductBarcode: (v: string) => void;
  setQuantity: (v: string) => void;
  setContainerBarcode: (v: string) => void;
  setStorageLocationBarcode: (v: string) => void;
  handleProductScan: (v: string) => void;
  onReset: () => void;
  handleSubmit: () => void;
  handleNext: () => void;
  handleBack: () => void;
  setCurrentStep: (v: number) => void;
  setError: (v: string | null) => void;
};

export type UseSortationReturn = {
  state: SortationState;
  actions: SortationActions;
};

const ALLOWED_STATUSES = ['PENDING', 'STARTED'];

export const useSortation = (): UseSortationReturn => {
  const [productBarcode, setProductBarcode] = useState<string>(EMPTY_STRING);
  const [quantity, setQuantity] = useState<string>(EMPTY_STRING);
  const [containerBarcode, setContainerBarcode] = useState<string>(EMPTY_STRING);
  const [storageLocationBarcode, setStorageLocationBarcode] = useState<string>(EMPTY_STRING);

  const [product, setProduct] = useState<SortationProduct | null>(null);
  const [task, setTask] = useState<SortationTask | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const validateQuantity = useCallback((qtyStr: string, maxQty: number) => {
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) {
      return 'Please enter a valid quantity.';
    }
    if (qty > maxQty) {
      return `Quantity cannot exceed task quantity (${maxQty}).`;
    }
    return null;
  }, []);

  const validateContainer = useCallback((barcode: string, expectedBarcode?: string) => {
    if (!barcode) {
      return 'Please scan an outbound container.';
    }
    if (expectedBarcode && barcode !== expectedBarcode) {
      return `Invalid container. Expected: ${expectedBarcode}`;
    }
    return null;
  }, []);

  const getDestinationDisplay = useCallback((destination: any) => {
    if (!destination) {
      return EMPTY_STRING;
    }
    return `${destination.zoneName ?? HYPHEN} / ${destination.name ?? HYPHEN}`;
  }, []);

  const handleProductScanResponse = useCallback(
    (response: any) => {
      setLoading(false);
      if (response && !response.error) {
        const { product: responseProduct, tasks } = response;
        const filteredTasks = (tasks || []).filter((t: SortationTask) => ALLOWED_STATUSES.includes(t.status));

        if (filteredTasks.length === 0) {
          setError('No pending tasks found for this product.');
          setProductBarcode(EMPTY_STRING);
        } else {
          setProduct(responseProduct);
          const firstTask = filteredTasks[0];
          setTask(firstTask);
          setStorageLocationBarcode(getDestinationDisplay(firstTask.destination));
          setCurrentStep(2);
        }
      } else {
        setError(response?.errorMessage || 'Product not found.');
        setProductBarcode(EMPTY_STRING);
      }
    },
    [getDestinationDisplay]
  );

  const handleProductScan = useCallback(
    (code: string) => {
      if (code === EMPTY_STRING) {
        return;
      }
      setLoading(true);
      setError(null);
      dispatch(getSortationDetailsByBarcode(code, handleProductScanResponse));
    },
    [dispatch, handleProductScanResponse]
  );

  const onReset = useCallback(() => {
    setProductBarcode(EMPTY_STRING);
    setQuantity(EMPTY_STRING);
    setContainerBarcode(EMPTY_STRING);
    setStorageLocationBarcode(EMPTY_STRING);
    setProduct(null);
    setTask(null);
    setCurrentStep(1);
    setIsSorted(false);
    setError(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!task || !product) {
      setError('Please scan a valid product first.');
      setProductBarcode(EMPTY_STRING);
      setCurrentStep(1);
      return;
    }

    const validationError = validateQuantity(quantity, task.quantity);
    if (validationError) {
      setError(validationError);
      setQuantity(EMPTY_STRING);
      setCurrentStep(2);
      return;
    }

    const containerError = validateContainer(containerBarcode, task?.container?.locationNumber);
    if (containerError) {
      setError(containerError);
      setContainerBarcode(EMPTY_STRING);
      setCurrentStep(3);
      return;
    }

    setLoading(true);
    setError(null);
    const payload = {
      action: 'load',
      quantity: parseInt(quantity, 10),
      container: containerBarcode,
      override: true
    };

    dispatch(
      patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
        setLoading(false);
        if (response && !response.error) {
          setCurrentStep(4);
        } else {
          setError(response?.errorMessage || 'Failed to complete sortation.');
          setContainerBarcode(EMPTY_STRING);
          setCurrentStep(3);
        }
      })
    );
  }, [task, product, quantity, containerBarcode, dispatch, validateQuantity, validateContainer]);

  const handleNext = useCallback(() => {
    setError(null);
    if (currentStep === 1) {
      handleProductScan(productBarcode);
    } else if (currentStep === 2) {
      const validationError = task ? validateQuantity(quantity, task.quantity) : 'No task selected';
      if (!validationError) {
        setCurrentStep(3);
      } else {
        setError(validationError);
        setQuantity(EMPTY_STRING);
      }
    } else if (currentStep === 3) {
      handleSubmit();
    } else if (currentStep === 4) {
      setIsSorted(true);
    }
  }, [currentStep, handleProductScan, productBarcode, quantity, task, validateQuantity, handleSubmit]);

  const handleBack = useCallback(() => {
    if (currentStep === 4) {
      return;
    }
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onReset();
    }
  }, [currentStep, onReset]);

  const state = useMemo(
    () => ({
      productBarcode,
      quantity,
      containerBarcode,
      storageLocationBarcode,
      loading,
      currentStep,
      isSorted,
      error,
      task
    }),
    [productBarcode, quantity, containerBarcode, storageLocationBarcode, loading, currentStep, isSorted, error, task]
  );

  const actions = useMemo(
    () => ({
      setProductBarcode: (v: string) => {
        setProductBarcode(v);
        setError(null);
      },
      setQuantity: (v: string) => {
        setQuantity(v);
        setError(null);
      },
      setContainerBarcode: (v: string) => {
        setContainerBarcode(v);
        setError(null);
      },
      setStorageLocationBarcode,
      handleProductScan,
      onReset,
      handleSubmit,
      handleNext,
      handleBack,
      setCurrentStep,
      setError
    }),
    [handleProductScan, onReset, handleSubmit, handleNext, handleBack]
  );

  return { state, actions };
};
