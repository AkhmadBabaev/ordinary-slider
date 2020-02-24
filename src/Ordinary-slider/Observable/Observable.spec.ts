import Observable from './Observable';

describe('Observable', () => {
  const observable = new Observable();

  test('adds callback to observers and send them data', () => {
    const callback = jest.fn();

    observable.subscribe(callback);
    observable.notify({ date: 'is notified' });

    expect(callback).toHaveBeenCalledWith({ date: 'is notified' });
  });

  test('should delete callback from observers', () => {
    const secondCallback = jest.fn();

    observable.subscribe(secondCallback);
    observable.unsubscribe(secondCallback);
    observable.notify({ date: 'is notified' });

    expect(secondCallback).not.toHaveBeenCalled();
  });
});
