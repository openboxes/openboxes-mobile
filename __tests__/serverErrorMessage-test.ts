import { formatServerErrorMessage } from '../src/utils/serverErrorMessage';

describe('formatServerErrorMessage', () => {
  it('replaces a Grails validation dump with its default message', () => {
    const message =
      'Validation error. validation errors:\n- Field error in object org.pih.warehouse.api.putaway.SearchPutawayTaskCommand ' +
      'on field container: rejected value [null]; codes [notFound.container,notFound]; arguments [BOGUS999]; ' +
      'default message [Container {0} not found]\n';

    expect(formatServerErrorMessage(message)).toBe('Container BOGUS999 not found');
  });

  it('joins several field errors and fills every placeholder', () => {
    const message =
      '- Field error: arguments [bin, A-1]; default message [{0} {1} is locked]\n' +
      '- Field error: arguments [5]; default message [Quantity {0} is too high]';

    expect(formatServerErrorMessage(message)).toBe('bin A-1 is locked. Quantity 5 is too high');
  });

  it('leaves other messages untouched', () => {
    expect(formatServerErrorMessage('Task is already picked')).toBe('Task is already picked');
  });
});
