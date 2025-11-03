import { WizardActorContext } from "../../wizard-machine";
import DataFieldStep1 from "./data-field-step-1";

export default function DataFieldStep1Review() {
    const wizardActorRef = WizardActorContext.useActorRef();
    const { formData } = wizardActorRef.getSnapshot().context;

    return <DataFieldStep1 formData={formData} />;
}
