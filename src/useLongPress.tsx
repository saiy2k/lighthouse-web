import { useCallback, useRef, useState } from "react";

//https://stackoverflow.com/a/48057286/390150
const useLongPress = (
    passBack: any,
    onLongPress: any,
    onClick: any,
    { shouldPreventDefault = true, delay = 300 } = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const timeout = useRef<any>();
    const target = useRef<any>();

    const start = useCallback((event: any) => {
        if (shouldPreventDefault && event.target) {
            event.target.addEventListener("touchend", preventDefault, {
                passive: false
            });
            target.current = event.target;

            setClickCount((prev) => prev + 1);

            if (event.changedTouches && event.changedTouches.length > 0) {
                setX(event.changedTouches[0].clientX);
                setY(event.changedTouches[0].clientY);
            }

        }
        timeout.current = setTimeout(() => {
            onLongPress(passBack, event);
            setLongPressTriggered(true);
        }, delay);
    }, [onLongPress, delay, shouldPreventDefault]);

    const clear = useCallback((event: any, shouldTriggerClick = true) => {
        timeout.current && clearTimeout(timeout.current);
        const threshold = 5;

        //console.log('changedTouches: ', event.changedTouches && event.changedTouches.length && event.changedTouches[0]);
        if (event.changedTouches && event.changedTouches.length > 0) {
            if (Math.abs(event.changedTouches[0].clientX - x) < 5 && Math.abs(event.changedTouches[0].clientY - y) < 5) {
                shouldTriggerClick && !longPressTriggered && onClick(passBack, event);
            } 
        } else {
            shouldTriggerClick && !longPressTriggered && onClick(passBack, event);
        }

        setLongPressTriggered(false);
        if (shouldPreventDefault && target.current) {
            target.current.removeEventListener("touchend", preventDefault);
        }
    }, [shouldPreventDefault, onClick, longPressTriggered]);

    return {
        onMouseDown: (e: any) => start(e),
        onTouchStart: (e: any) => start(e),
        onMouseUp: (e: any) => clear(e),
        onMouseLeave: (e: any) => clear(e, false),
        onTouchEnd: (e: any) => clear(e)
    };
};

const isTouchEvent = (event: any) => {
    return "touches" in event;
};

const preventDefault = (event: any) => {
    if (!isTouchEvent(event)) return;

    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};

export default useLongPress;
