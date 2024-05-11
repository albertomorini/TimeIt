import { IonContent } from "@ionic/react";
import { useEffect, useState } from "react";


const Timer = (props) => {


    const calculateTimeLeft = () => {
        let year = new Date().getFullYear();
        let difference = +new Date(`10/01/${year}`) - +new Date();

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());



    function startTimer(timing) {
        let t = Time - 1
        console.log(t);
        setTime(t)

    }


    // ...

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    // ...

    // ...

    // const timerComponents = [];

    // Object.keys(timeLeft).forEach((interval) => {
    //     if (!timeLeft[interval]) {
    //         return;
    //     }

    //     timerComponents.push(
    //         <span>
    //             {timeLeft[interval]} {interval}{" "}
    //         </span>
    //     );
    // });

    // ...


    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return (
        <IonContent>


            {timerComponents.length ? timerComponents : <span>Time's up!</span>}


        </IonContent>
    )
}


export default Timer;
