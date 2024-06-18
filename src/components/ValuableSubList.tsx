import * as React from "react";
import {useEffect, useState} from "react";
import {Chip} from "@nextui-org/react";
import SettingsIcon from "@mui/icons-material/Settings";
import relicUtils from "@/utils/relicUtils.ts";
import {toast} from "react-toastify";
import SubStatsDropDown from "@/components/SubStatsDropDown.tsx";
import useRelicStore from "@/store/relicStore.ts";


const ValuableSubList: React.FC = () => {

    const {relicTitle, mainRelicStats, relicRatingInfo, fetchRelicRatingInfo} = useRelicStore();

    const [selectedStats, setSelectedStats] = useState<Set<string>>(new Set([]));

    useEffect(() => {
        setSelectedStats(new Set(relicRatingInfo?.valuableSub || []));
    }, [relicRatingInfo]);

    if (!relicTitle || !mainRelicStats || !relicRatingInfo?.valuableSub) {
        return null
    }


    const onSelectionChange = async (selectedKeys: Set<string>) => {
        console.log("selectedKeys", [...selectedKeys]);

        const result = await relicUtils.updateRelicRatingValuableSub(relicTitle, mainRelicStats.name, [...selectedKeys]);

        if (result.success) {
            // Update the state only after the successful update to ensure consistency
            setSelectedStats(new Set(selectedKeys)); // Update state if successful
            await fetchRelicRatingInfo();
            console.log(result.message)
        } else {
            toast(result.message, {type: "error"})
        }
    };


    return (
        <div className={"w-min h-fit"}>
            <SubStatsDropDown
                trigger={
                    <div className="flex flex-row cursor-pointer gap-2">
                        <div className={"font-bold text-nowrap"}>
                            有效副属性
                        </div>
                        <SettingsIcon/>
                    </div>
                }
                selectedKeys={selectedStats}
                onSelectionChange={onSelectionChange}
            />
            <ul className={"flex flex-col gap-2 float-left mt-2"}>
                {[...selectedStats].map((valuableSubStat, index) => {
                    return <li key={index}>
                        <Chip color="success" variant="shadow" radius="sm">
                            {valuableSubStat}
                        </Chip>
                    </li>
                })}
            </ul>
        </div>
    )
}


export default ValuableSubList
