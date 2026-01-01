/**
 * Active Digital Signal subscription
 */
export interface DigitalSignal {
    /**
     * $state of current value of the signal. Set to write value to control system.
     */
    value: boolean;
    /**
     * Pulse the signal.
     */
    pulse: () => void;
}
/**
 * Subscribe to a Digital signal provided by the CrComLib.
 * The signal is provided as an object with a value property that is a $state<boolean> rune.
 * An optional set property is provided to set the value of the signal. When specified, setting the value rune will write
 * to the control system. This is useful when biding the signal to a field or component.
 *
 * Signal setter uses repeat digital to hold the signal high when set to true, and will not trigger the CH5 Emulator.
 * Pulse method generates an instantaneous rising and falling edge on the signal.
 *
 * @param fbSignal Signal name in contract file, or join number as a string to receive feedback from.
 * @param setSignal Signal name in contract file, or join number as a string to send a value to. If not provided, the feedback signal will be used.
 * @returns {value, pulse}, value is the current value of the signal as a $state rune, value setter writes value to control system, pulse is a function that will pulse the signal.
 */
export declare function useDigital(fbSignal: string, setSignal?: string): DigitalSignal;
/**
 * Set the state (true or false) of a digital signal. This does not provide feedback.
 * This uses RepeatDigital under the hood, to hold the signal high.
 *
 * @param signal Signal name in contract file, or join number as a string to send a value to.
 * @param value Boolean value to set the signal to.
 */
export declare function setDigital(signal: string, value: boolean): void;
/**
 * Pulse the specified digital signal.
 * This generates an instantaneous rising and falling edge on the signal.
 * This should be used for any logic that does nto require a persistent hold.
 *
 * @param signal `string` Signal Name in Contract file, or join number as a string
 */
export declare function pulseDigital(signal: string): void;
