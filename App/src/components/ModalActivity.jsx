import { IonButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { forwardRef, useImperativeHandle, useRef } from "react";

import ContentActivity from "./ContentActivity";

const ModalActivity = forwardRef((props,ref) => {

    const refModal = useRef();

    useImperativeHandle(ref, ()=>({
        editActivity: async() =>{
            //TODO via props pass the data
            refModal?.current?.present()
        }
    }))

    return (
        <IonModal trigger="newActivity" ref={refModal}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>New activity</IonTitle>
                    <IonButton color="danger" slot="end"
                        size="small"
                        onClick={() => {
                            refModal?.current?.dismiss()
                            cleanInputs()
                        }}
                    >
                        <IonIcon icon={closeOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <ContentActivity />

        </IonModal>
    )
})


export default ModalActivity;