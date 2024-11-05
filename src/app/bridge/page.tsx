import FeatureBox from "@/components/layout/FeatureBox";
import ShapesPage from "@/components/layout/shapes";
import TransformDataHorizontalIcon from "@/components/icons/transform-data-horizontal";
import TokenPlaceHolderEnableIcon from "@/components/icons/token-placeholder-enable";
import TokenPlaceHolderDisableIcon from "@/components/icons/token-placeholder-disable";
import ArrowDownIcon from "@/components/icons/arrow-down";
import { cn } from "@/lib/utils";

const BridgeHome = () => {
  return (
    <div className="relative w-full h-full mt-14 modified-container flex justify-center">
      <ShapesPage />
      <div className="flex justify-center items-center h-full w-full z-10">
        <FeatureBox>
          <div className="flex flex-col gap-12 items-center w-full">
            {/* header */}
            <div className="flex justify-between items-center w-full">
              <h3 className="text-heading-3 font-bold">Bridge</h3>
              <div className="flex items-center gap-2">
                <TransformDataHorizontalIcon />
                <span className="text-caption-bold font-medium">
                  Change to swap
                </span>
              </div>
            </div>
            {/* body */}
            <div className="flex flex-col gap-12 items-center w-full">
              {/* inputs */}
              <div className="w-full flex flex-col gap-4">
                <div className="lg:px-12 py-8 text-white lg:text-primary  flex items-center gap-4 text-hero-bold font-bold w-full lg:bg-background-main rounded-2xl border-2 relative border-white">
                  <TokenPlaceHolderEnableIcon />
                  <span> Select Token</span>
                  <span
                    className={cn(
                      "p-5 rounded-round flex items-center gap-4 bg-[#C0C0C0] border-2 border-white",
                      "absolute left-1/2 -translate-x-1/2 -bottom-10 z-10"
                    )}
                  >
                    <ArrowDownIcon />
                  </span>
                </div>
                <div className="lg:px-12 py-8 text-secondary flex items-center gap-4 text-hero-bold font-bold w-full lg:bg-background-main rounded-2xl border-2 border-white">
                  <TokenPlaceHolderDisableIcon />
                  <span> Select Token</span>
                </div>
              </div>
            </div>
            {/* footer */}
            <div className="w-11/12 bg-primary-buttons py-4 rounded-ml text-center text-content-bold font-medium text-white">
              Connect Wallet
            </div>
          </div>
        </FeatureBox>
      </div>
    </div>
  );
};

export default BridgeHome;
