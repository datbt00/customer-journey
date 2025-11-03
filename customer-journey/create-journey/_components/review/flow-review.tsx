import { WizardActorContext } from "../../wizard-machine";
import Flow from "./flow";

export default function FlowReview() {
    const wizardActorRef = WizardActorContext.useActorRef();
    const { formData } = wizardActorRef.getSnapshot().context;

    return <Flow formData={formData} />;
}
