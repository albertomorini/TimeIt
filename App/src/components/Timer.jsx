import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonModal, IonProgressBar, IonRow, IonToolbar } from "@ionic/react";
import { closeOutline, playOutline, stopOutline, time } from "ionicons/icons";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "../theme/timer.css";

const Timer = forwardRef((props, ref) => {

    const refModalTimer = useRef()
    let dummyDate = new Date();
    const [DummyDate, setDummyDate] = useState(new Date())
    let timer = null;
    const [TimeLeft, setTimeLeft] = useState(null); //difference time
    const [SliderValue, setSliderValue] = useState(1);
    const [InitialTimer, setInitialTimer] = useState(null);

    /**
     * 
     * @param {int} p_hours hour desidered
     * @param {int} p_minutes minutes desired
     * @param {int} p_seconds seconds desired
     */
    function initializeTimer(p_hours = 0, p_minutes = 0, p_seconds = 0) {
        //TODO: manage the offset for the otherside of the world

        DummyDate.setHours(
            (dummyDate.getUTCHours() - (DummyDate.getTimezoneOffset() / 60) + p_hours)//remove the offset
        ) // set parametric hours
        DummyDate.setUTCMinutes(DummyDate.getMinutes() + p_minutes) // set parametric minutes
        DummyDate.setUTCSeconds(DummyDate.getSeconds() + p_seconds) // set parametric seconds

        let difference = DummyDate - +new Date();
        let tmp = 0;
        if (difference > 0) {
            tmp = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        setInitialTimer(tmp);

    }

    let xtmp = 0;
    const calculateTimeLeft = () => {

        let difference = DummyDate - +new Date();
        if (xtmp == 0) {
            xtmp = difference
        }
        console.log(difference);
        setSliderValue((difference / xtmp));
        let tmp = 0;
        if (difference > 0) {
            tmp = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return tmp;
    }


    function startTimer() {

        timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000); //every second
    }

    function clearTimer() {
        clearInterval(timer);
        timer=null;
    }




    useImperativeHandle(ref, () => ({
        //salva l'intervento
        setTimer: async (hour, minutes, seconds) => {
            console.log("TEST");
            console.log(props);
            initializeTimer(hour, minutes, seconds); //initialize the timer by adding an offset {hour,minutes,seconds}
            //SHOW THE TIMER
            refModalTimer?.current?.present()
        }
    }));



    return (
        <IonModal ref={refModalTimer}
            onIonModalDidDismiss={() => {
                console.log(props)
            }}
        >
            <IonHeader>
                <IonToolbar>
                    <IonButton color="danger" slot="end"
                        onClick={() => {
                            refModalTimer?.current?.dismiss()
                        }}
                    >
                        <IonIcon icon={closeOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>


            <IonContent>
                {
                    (SliderValue > 0) ?
                        <h2 className="centerNumbers">
                            {
                                (TimeLeft == null) ?
                                    (InitialTimer?.hours < 10) ? "0" + InitialTimer?.hours : InitialTimer?.hours
                                    :
                                    (TimeLeft?.hours < 10) ?
                                        "0" + TimeLeft?.hours
                                        :
                                        TimeLeft?.hours
                            }
                            :
                            {
                                (TimeLeft == null) ?
                                    (InitialTimer?.minutes < 10) ? "0" + InitialTimer?.minutes : InitialTimer?.minutes
                                    :
                                    (TimeLeft?.minutes < 10) ?
                                        "0" + TimeLeft?.minutes
                                        :
                                        TimeLeft?.minutes
                            }
                            :
                            {
                                (TimeLeft == null) ?
                                    (InitialTimer?.seconds < 10) ? "0" + InitialTimer?.seconds : InitialTimer?.seconds
                                    :
                                    (TimeLeft?.seconds < 10) ?
                                        "0" + TimeLeft?.seconds
                                        :
                                        TimeLeft?.seconds
                            }
                        </h2>
                        :
                        <h2 className="TimeUpMessage">Time is up!</h2>
                }

                <IonRow>
                    <IonCol>
                        <IonButton
                            disabled={(SliderValue == 1) ? true : false}
                            className="buttonsTimer"
                            style={{ float: "left" }}
                            onClick={() => {
                                clearTimer()
                            }}
                            color="danger"
                        > Stop
                            <IonIcon icon={stopOutline} />
                        </IonButton>
                    </IonCol>
                    <IonCol>

                        <IonButton
                            style={{ float: "right" }}

                            onClick={() => {
                                startTimer()
                            }}
                            className="buttonsTimer"
                        > Start
                            <IonIcon icon={playOutline} />
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
        </IonModal>
    )
});


export default Timer;
