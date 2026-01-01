/**
 * Active Analog Signal subscription
 */
export interface AnalogSignal {
    /**
     * $state of current value of the signal. Set to write value to control system.
     */
    value: number;
    value_signed: number;
}
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
export declare function useAnalog(fbSignal: string, setSignal?: string): AnalogSignal;
/**
 * Set the value of an analog signal.
 * This does not subscribe to the signal or provide feedback.
 *
 * @param signal Signal name in contract file, or join number as a string
 * @param value Value to set the signal to
 */
export declare function setAnalog(signal: string, value: number): void;
