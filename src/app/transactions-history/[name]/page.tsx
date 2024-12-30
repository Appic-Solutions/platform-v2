import Box from "@/common/components/ui/box";
import { cn } from "@/common/helpers/utils";
import { PAGE_PARAMS_DATA, PageParamsItem } from "../_constants";
import BackButton from "@/common/components/ui/BackButton";
import TabSection from "../_components/TabSections";

export function generateStaticParams() {
    return PAGE_PARAMS_DATA
}

export default function TransactionsHistoryPage({ params }: { params: PageParamsItem }) {
    return (
        <Box className={cn(
            "flex flex-col justify-start gap-4 h-full overflow-visible duration-300 ease-in-out",
            "max-md:px-0 md:min-h-[10vh] md:px-[35px] md:py-[30px] md:max-w-[617px]",
        )}>
            {/* Head Title */}
            <div className="flex items-center justify-center mb-8 text-white md:text-black md:dark:text-white">
                <BackButton />
                <p className="text-xl md:text-3xl font-bold">{params.name}</p>
            </div>

            {/* Tab Section */}
            <TabSection defaultValue={params.name} />
        </Box>
    );
};