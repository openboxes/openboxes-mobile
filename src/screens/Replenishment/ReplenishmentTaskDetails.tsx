import React from 'react';

import { ProductDetails } from '../../components/ProductDetails';
import { HYPHEN } from '../../constants';
import { ReplenishmentList, ReplenishmentTask } from '../../types/replenishment';
import { parseFromISODateToLocaleString } from '../../utils/utils';

type Props = {
  task: ReplenishmentTask;
  list?: ReplenishmentList;
  taskIndex: number;
  tasksCount: number;
};

/** The replenishment task card shown above the scan field of each step */
export function ReplenishmentTaskDetails({ task, list, taskIndex, tasksCount }: Props) {
  const pickLocation = task.location ? `${task.location.name} (${task.location.locationNumber})` : HYPHEN;

  return (
    <ProductDetails.Provider product={task.product} status={task.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="identifier" label="Replenishment">
            {list?.orderNumber ?? task.orderNumber ?? HYPHEN}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Task">
            {`${taskIndex + 1} / ${tasksCount}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />
        <ProductDetails.Caption
          title={task.inventoryItem?.lotNumber}
          subtitle={
            task.inventoryItem?.expirationDate
              ? parseFromISODateToLocaleString(task.inventoryItem.expirationDate)
              : undefined
          }
        />

        <ProductDetails.List
          items={[
            { icon: 'pin', label: 'Pick Location', value: pickLocation },
            {
              icon: 'package',
              label: 'Quantity',
              value: `${task.quantityPicked || 0} / ${task.quantityRequired}`
            },
            {
              icon: 'store',
              label: 'Replenish To',
              value: task.destinationLocation?.name || HYPHEN
            }
          ]}
        />
      </ProductDetails.Root>
    </ProductDetails.Provider>
  );
}
