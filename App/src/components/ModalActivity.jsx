import { IonButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import ContentActivity from "./ContentActivity";

const ModalActivity = forwardRef((props,ref) => {

    const refModal = useRef();
    const [EditingValues,setEditingValues] = useState({
        title: null,
        mode: null,
        timer: null
    })

    useImperativeHandle(ref, ()=>({
        editActivity: async(title,mode,timer) =>{
            setEditingValues({
                title: title,
                mode: mode,
                timer: timer
            })
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

            <ContentActivity 
                defaultValues={EditingValues}
            />

        </IonModal>
    )
})


export default ModalActivity;