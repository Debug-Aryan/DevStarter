import { useState } from "react";
import { StackSelector, FeatureToggle, ProjectInfoForm } from "../features/generator";

export default function Generator() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <>
      <div>
        {step === 1 && <StackSelector onNext={nextStep} />}
        {step === 2 && <FeatureToggle onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <ProjectInfoForm onBack={prevStep} />}
      </div>
    </>
  );
}
