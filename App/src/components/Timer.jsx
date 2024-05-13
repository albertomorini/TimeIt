import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonModal, IonProgressBar, IonRow, IonToolbar } from "@ionic/react";
import { closeOutline, playOutline, stopOutline } from "ionicons/icons";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "../theme/timer.css";
import moment from "moment";

const Timer = forwardRef((props, ref) => {

    const refModalTimer = useRef()

    let [AbsDifference, setAbsDifference] = useState(null);
    let [IsPause, setIsPause] = useState(false);
    var timer = null;

    let [InitialDifference, setInitialDifference] = useState(null);


    /**
     * 
     * @param {int} p_hours hour desidered
     * @param {int} p_minutes minutes desired
     * @param {int} p_seconds seconds desired
     */
    function initializeTimer(p_hours = 0, p_minutes = 0, p_seconds = 0) {

        let tmp = moment()
        tmp.add(p_hours, "hours")
        tmp.add(p_minutes, "minutes")
        tmp.add(p_seconds + 1, "seconds")//manual fix


        setInitialDifference(moment.duration(tmp.diff(moment().utc())));
        setAbsDifference(moment.duration(tmp.diff(moment().utc())));
        tmp = moment.duration(tmp.diff(moment().utc()))
        setTimeout(() => {
            document.getElementById("PlaceholderTimer").innerText = (tmp.hours() < 10 ? "0" + tmp.hours() : tmp.hours()) + ":" +
                (tmp.minutes() < 10 ? "0" + tmp.minutes() : tmp.minutes()) + ":" +
                (tmp.seconds() < 10 ? "0" + tmp.seconds() : tmp.seconds())
            document.getElementById("progressBar").value = 1
        }, 1000) //just wait to load the dom
    }

    function startTimer(flgPause = false) {
        //NB: in interval we can't relay to the react state --> interval already loads the "state" so change it doesn't works
        timer = setInterval(() => {
            if (!flgPause) {
                setAbsDifference(
                    AbsDifference.subtract(1, "seconds") //remove 1 sec
                )
                let text = "Time is up!"
                if (AbsDifference > 0) {
                    text = (AbsDifference.hours() < 10 ? "0" + AbsDifference.hours() : AbsDifference.hours()) + ":" +
                        (AbsDifference.minutes() < 10 ? "0" + AbsDifference.minutes() : AbsDifference.minutes()) + ":" +
                        (AbsDifference.seconds() < 10 ? "0" + AbsDifference.seconds() : AbsDifference.seconds())
                } else {
                    //STOP THE TIMER
                    clearInterval(timer);
                    timer = null;
                }
                document.getElementById("PlaceholderTimer").innerText = text
                document.getElementById("progressBar").value = (AbsDifference / InitialDifference)
                if (AbsDifference / InitialDifference < 0.4 && AbsDifference / InitialDifference > 0.2) {
                    document.getElementById("progressBar").color = "warning"
                } else if (AbsDifference / InitialDifference < 0.2) {
                    document.getElementById("progressBar").color = "danger"
                }
            }
        }, 1000); //every 1 second
    }

    function pauseTimer() {
        clearInterval(timer);
        timer = null;
    }


    function clearTimer() {
        setAbsDifference(null)
        setInitialDifference(null)
        clearTimeout(timer);
        timer = null;
        setIsPause(false)
    }

    useImperativeHandle(ref, () => ({
        //salva l'intervento
        setTimer: async (hour, minutes, seconds) => {

            initializeTimer(hour, minutes, seconds); //initialize the timer by adding an offset {hour,minutes,seconds}
            //SHOW THE TIMER
            refModalTimer?.current?.present();

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

            <IonContent className="ion-padding">

                <h2 className="centerNumbers">
                    <p id="PlaceholderTimer"></p>
                    <IonProgressBar id="progressBar" />
                </h2>


                <IonRow>

                    {(IsPause) ?
                        <IonCol>
                            <IonButton

                                className="buttonsTimer"
                                style={{ float: "right" }}
                                onClick={() => {
                                    if (!IsPause) {
                                        pauseTimer()
                                        setIsPause(true)
                                    } else {
                                        startTimer(false)

                                    }
                                }}
                                color="danger"
                            > Pause
                                <IonIcon icon={stopOutline} />
                            </IonButton>
                        </IonCol>
                        :
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
                        </IonCol>}

                </IonRow>


            </IonContent>
        </IonModal>
    )
});


export default Timer;
