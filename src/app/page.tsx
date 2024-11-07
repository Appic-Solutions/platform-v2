import FeatureBox from "@/components/layout/FeatureBox";
import ShapesPage from "@/components/layout/shapes";
import TransformDataHorizontalIcon from "@/components/icons/transform-data-horizontal";
import TokenPlaceHolderIcon from "@/components/icons/token-placeholder";
import ArrowDownIcon from "@/components/icons/arrow-down";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

const BridgeHome = () => {
  return (
    <div className="relative w-full h-full flex justify-center px-6 xl:px-12">
      <ShapesPage />
      <div className="flex justify-center items-center h-full w-full z-10">
        <FeatureBox>
          <div className="flex flex-col gap-12 items-center w-full max-w-lg lg:max-w-full ">
            {/* header */}
            <div className="flex justify-between items-center w-full">
              <h3 className="text-mobile-heading-2 md:text-heading-3 font-bold text-primary">
                Bridge
              </h3>
              <div className="flex items-center gap-2">
                <TransformDataHorizontalIcon className="stroke-primary" />
                <span className="text-caption-bold font-medium text-primary">
                  Change to swap
                </span>
              </div>
            </div>
            {/* body */}
            <div className="flex flex-col gap-12 items-center w-full">
              {/* inputs */}
              <div className="w-full flex flex-col gap-4 items-center">
                <Card>
                  <div className="flex items-center gap-4">
                    <TokenPlaceHolderIcon className="fill-primary stroke-white dark:stroke-black" />
                    <span className="text-primary text-mobile-heading-2">
                      Select Token
                    </span>
                    <span
                      className={cn(
                        "p-5 rounded-round flex items-center gap-4 bg-muted border-2 border-white",
                        "absolute left-1/2 -translate-x-1/2 -bottom-10 z-10"
                      )}
                    >
                      <ArrowDownIcon className="fill-primary" />
                    </span>
                  </div>
                </Card>
                <Card>
                  <div className="flex relative items-center gap-4">
                    <TokenPlaceHolderIcon className="fill-muted stroke-white dark:stroke-black" />
                    <span className="text-muted text-mobile-heading-2">
                      Select Token
                    </span>
                  </div>
                </Card>
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
