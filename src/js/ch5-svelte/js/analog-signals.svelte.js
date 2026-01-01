/**
 * Subscribe to an Analog signal provided by the CrComLib.
 * The signal is provided as an object with a value property that is a $state<number> rune.
 * An optional set property is provided to set the value of the signal. When specified, setting the value rune will write
 * to the control system. This is useful when biding the signal to a field or component.
 *
 * @param fbSignal Signal name in contract file, or join number as a string to receive feedback from.
 * @param setSignal Signal name in contract file, or join number as a string to send a value to. If not provided, the feedback signal will be used.
 * @returns {AnalogSignal} value is the current value of the signal as a $state rune, value setter writes value to control system.
 */
export function useAnalog(fbSignal, setSignal) {
    if (!window.CrComLib)
        throw new Error('CrComLib is not available. Make sure to include the CrComLib script in your project. (see the README.md for more information)');
    const convert_signed = (value) => value > 32767 ? value - 65536 : value;
    const convert_unsigned = (value) => value < 0 ? value + 65536 : value;
    let value = $state(window.CrComLib.getState('n', fbSignal, 0));
    let value_signed = $derived(convert_signed(value));
    $effect(() => {
        const sub = window.CrComLib.subscribeState('n', fbSignal, (v) => {
            value = v;
        });
        return () => {
            window.CrComLib.unsubscribeState('n', fbSignal, sub);
        };
    });
    const set = (v) => {
        setAnalog(setSignal ?? fbSignal, v);
    };
    return {
        get value() {
            return value;
        },
        get value_signed() {
            return value_signed;
        },
        set value(v) {
            set(v);
        },
        set value_signed(v) {
            set(convert_unsigned(v));
        }
    };
}
/**
 * Set the value of an analog signal.
 * This does not subscribe to the signal or provide feedback.
 *
 * @param signal Signal name in contract file, or join number as a string
 * @param value Value to set the signal to
 */
export function setAnalog(signal, value) {
    if (!window.CrComLib)
        throw new Error('CrComLib is not available. Make sure to include the CrComLib script in your project. (see the README.md for more information)');
    window.CrComLib.publishEvent('n', signal, value);
}
