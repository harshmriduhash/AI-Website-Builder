import {
  CheckCircledIcon,
  CircleIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}

export interface IStep {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  code?: string;
  type?: StepType;
  path?: string;
}

interface IStepsProps {
  steps: IStep[];
}

const displayIcon = (status: string) => {
  if (status === "pending") return <CircleIcon className="w-5 h-6" />;
  if (status === "in-progress")
    return <DotsHorizontalIcon color="orange" className="w-5 h-6" />;
  if (status === "completed")
    return <CheckCircledIcon color="green" className="w-5 h-6" />;
};

const Steps = ({ steps }: IStepsProps) => {
  return (
    <div className="p-5 h-[85vh] overflow-auto">
      <h2 className="text-white mb-6 text-xl font-bold italic">BUILD STEPS</h2>

      {steps.map((step: IStep, index: number) => {
        return (
          <div
            key={`${step.path}-${index}`}
            className="flex flex-col gap-5 text-white"
          >
            <div className="flex gap-2">
              {displayIcon(step.status)} <h3>{step.title}</h3>
            </div>
            <p>{step.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Steps;
