import { InfoCircleIcon } from "@/components/icons";
import RHFSelect from "@/components/rhf/rhf-select";
import RHFUploadFile from "@/components/rhf/rhf-upload-file";
import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";

const options = [
  { label: "Ethereum", value: "ethereum" },
  { label: "Polygon", value: "polygon" },
  { label: "Arbitrum", value: "arbitrum" },
]


export default function Step1({ stepHandler }: { stepHandler: (mode: "next" | "prev") => void }) {
  return (
    <Box className="gap-y-8 justify-normal md:max-w-[620px] md:px-10 md:py-10 md:justify-between">
      <div
        className={cn(
          "flex items-center self-start gap-3.5 pl-3.5",
          "text-white md:text-black dark:text-white text-2xl font-bold",
          "md:text-4xl"
        )}>
        Create Twin Token
        <InfoCircleIcon />
      </div>
      <div className="w-full flex flex-col items-center justify-between gap-x-9 gap-y-8 md:flex-row">
        <RHFSelect
          name="test1"
          options={options}
          label="Select Blockchain"
          className="w-full max-w-[238px]"
        />
        <RHFSelect
          name="test2"
          options={options}
          label="Select Blockchain"
          className="w-full max-w-[238px]"
        />
      </div>
      <RHFUploadFile
        name="file"
        label="Upload File"
        maxSize={5}
        maxWidth={100}
        maxHeight={100}
      />
      <button
        type="button"
        onClick={() => stepHandler("next")}
        className="bg-primary-buttons w-full min-h-14 rounded-[16px] text-white"
      >
        Continue
      </button>
    </Box >
  )
}
