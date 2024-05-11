import { IonButton, IonCol, IonContent, IonIcon, IonModal, IonProgressBar, IonRow } from "@ionic/react";
import { useEffect, useState } from "react";
import "../theme/timer.css";
import { playOutline, stopOutline } from "ionicons/icons";

const Timer = (props) => {


    let dummyDate = new Date();
    let timer = null;
    const [timeLeft, setTimeLeft] = useState(null); //difference time
    const [SliderValue, setSliderValue] = useState(1);

    /**
     * 
     * @param {int} p_hours hour desidered
     * @param {int} p_minutes minutes desired
     * @param {int} p_seconds seconds desired
     */
    function initializeTimer(p_hours = 0, p_minutes = 0, p_seconds = 0) {
        //TODO: manage the offset for the otherside of the world

        dummyDate.setHours(
            (dummyDate.getUTCHours() - (dummyDate.getTimezoneOffset() / 60) + p_hours)//remove the offset
        ) // set parametric hours
        dummyDate.setUTCMinutes(dummyDate.getMinutes() + p_minutes) // set parametric minutes
        dummyDate.setUTCSeconds(dummyDate.getSeconds() + p_seconds) // set parametric seconds

    }

    let xtmp = 0;
    const calculateTimeLeft = () => {

        let difference = + dummyDate - +new Date();

        if (xtmp == 0) {
            xtmp = difference
        }

        setSliderValue((difference / xtmp));
        let timeLeft = 0;
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


    function startTimer() {
        timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000); //every second
    }

    function clearTimer() {
        clearInterval(timer);
    }

    useEffect(() => {

        //TODO: parametrize with props + manage the button start and stop --> eventually pause
        initializeTimer(0, 0, 30); //initialize the timer by adding an offset {hour,minutes,seconds}

    }, []);


    return (
        // <IonModal>
            <IonContent>
                {
                    (SliderValue > 0) ?
                        <h2 className="centerNumbers">
                            {(timeLeft?.hours < 10) ?
                                "0" + timeLeft?.hours
                                :
                                timeLeft?.hours
                            }
                            :
                            {(timeLeft?.minutes < 10) ?
                                "0" + timeLeft?.minutes
                                :
                                timeLeft?.minutes
                            }
                            :
                            {(timeLeft?.seconds < 10) ?
                                "0" + timeLeft?.seconds
                                :
                                timeLeft?.seconds
                            }
                        </h2>
                        :
                        <h2 lassName="centerNumbers">Time is up!</h2>
                }

                <IonRow>
                    <IonCol>

                        <IonButton onClick={() => {
                            startTimer()
                        }}
                            className="buttonsTimer"
                        > Start
                            <IonIcon icon={playOutline} />
                        </IonButton>
                    </IonCol>
                    <IonCol>
                        <IonButton
                            disabled={(SliderValue == 1) ? true : false}
                            className="buttonsTimer"
                            style={{ float: "right" }}
                            onClick={() => {
                                clearTimer()
                            }}
                            color="danger"
                        > Stop
                            <IonIcon icon={stopOutline} />
                        </IonButton>
                    </IonCol>
                </IonRow>


                <IonProgressBar
                    value={SliderValue}
                    color={
                        (SliderValue > 0.4) ? "primary" :
                            (SliderValue > 0.2) ? "warning" : "danger"
                    }
                ></IonProgressBar>

            </IonContent>
        // </IonModal>
    )
}


export default Timer;
