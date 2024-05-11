import { IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkOutline, createOutline } from "ionicons/icons";
import ModalActivity from "../components/ModalActivity";
import Timer from "../components/Timer";


const TodoList = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Time It</IonTitle>
                    <ModalActivity />
                </IonToolbar>
            </IonHeader>


            <IonContent className="ion-padding">

                <IonItemSliding>
                    <IonItem>
                        <IonCheckbox></IonCheckbox>
                        <IonText className="ion-text-start">Lavare il gatto</IonText>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption >
                            <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                            Edit
                        </IonItemOption>
                        <IonItemOption color="success" >
                            <IonIcon slot="bottom" icon={checkmarkOutline}></IonIcon>
                            Done
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
                <IonItemSliding>
                    <IonItem>
                        <IonCheckbox></IonCheckbox>
                        <IonText>Bagnare le piante</IonText>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption >
                            <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                            Edit
                        </IonItemOption>
                        <IonItemOption color="success" >
                            <IonIcon slot="bottom" icon={checkmarkOutline}></IonIcon>
                            Done
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>


                <Timer />

            </IonContent>
        </>

    )
};


export default TodoList;