"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { FormControl } from "@/components/atoms/FormField";
import FormLabel from "@/components/atoms/FormLabel";
import Checkbox from "@/components/atoms/Checkbox";
import { useDatePicker } from "@/hooks/useDataPicker";
import { cn } from "@/libs/utils";

type WorkHistoryItemProps = {
  index: number;
  displayIndex: number; // Display order (1, 2, 3, ...)
  yearJoinedField: string;
  monthJoinedField: string;
  yearLeftedField: string;
  monthLeftedField: string;
  companyNameField: string;
  positionField: string;
  inServiceField: string;
  removeWorkHistory: (index: number) => void;
  isEdit?: boolean;
  isBorderTop?: boolean;
  isCurrentCompany?: boolean;
};

const WorkHistoryItem = ({
  index,
  displayIndex,
  yearJoinedField,
  monthJoinedField,
  yearLeftedField,
  monthLeftedField,
  companyNameField,
  positionField,
  inServiceField,
  removeWorkHistory,
  isEdit = false,
  isBorderTop = true,
}: WorkHistoryItemProps) => {
  const t = useTranslations("registerMemberPage");
  const { setValue, clearErrors, trigger, control } = useFormContext();
  const isCurrentCompany = useWatch({ control, name: inServiceField });
  const [isInService, setIsInService] = useState(isCurrentCompany === "true");

  useEffect(() => {
    setIsInService(isCurrentCompany === "true");
  }, [isCurrentCompany]);

  const joinedDatePicker = useDatePicker();
  const leftedDatePicker = useDatePicker();

  const yearJoined = useWatch({ control, name: yearJoinedField });
  const monthJoined = useWatch({ control, name: monthJoinedField });
  const yearLefted = useWatch({ control, name: yearLeftedField });
  const monthLefted = useWatch({ control, name: monthLeftedField });

  const filteredYearLeftedOptions = useMemo(() => {
    if (!yearJoined || yearJoined === "") {
      return leftedDatePicker.yearOptions;
    }

    const joinedYear = parseInt(yearJoined, 10);
    return leftedDatePicker.yearOptions.filter((option) => {
      if (option.value === "") return true;
      const optionYear = parseInt(option.value, 10);
      return optionYear >= joinedYear;
    });
  }, [yearJoined, leftedDatePicker.yearOptions]);

  const filteredMonthLeftedOptions = useMemo(() => {
    if (!yearJoined || yearJoined === "" || !monthJoined || monthJoined === "") {
      return leftedDatePicker.monthOptions;
    }

    const joinedYear = parseInt(yearJoined, 10);
    const joinedMonth = parseInt(monthJoined, 10);

    if (!yearLefted || yearLefted === "" || parseInt(yearLefted, 10) > joinedYear) {
      return leftedDatePicker.monthOptions;
    }

    if (parseInt(yearLefted, 10) === joinedYear) {
      return leftedDatePicker.monthOptions.filter((option) => {
        if (option.value === "") return true;
        const optionMonth = parseInt(option.value, 10);
        return optionMonth >= joinedMonth;
      });
    }

    return leftedDatePicker.monthOptions;
  }, [yearJoined, monthJoined, yearLefted, leftedDatePicker.monthOptions]);

  useEffect(() => {
    if (isInService || !yearJoined || yearJoined === "") {
      return;
    }

    const joinedYear = parseInt(yearJoined, 10);
    const joinedMonth = monthJoined ? parseInt(monthJoined, 10) : null;

    if (yearLefted && yearLefted !== "") {
      const leftedYear = parseInt(yearLefted, 10);
      if (leftedYear < joinedYear) {
        setValue(yearLeftedField, "", { shouldValidate: false });
        setValue(monthLeftedField, "", { shouldValidate: false });
        clearErrors(yearLeftedField);
        clearErrors(monthLeftedField);
      } else if (leftedYear === joinedYear && joinedMonth && monthLefted && monthLefted !== "") {
        const leftedMonth = parseInt(monthLefted, 10);
        if (leftedMonth < joinedMonth) {
          setValue(monthLeftedField, "", { shouldValidate: false });
          clearErrors(monthLeftedField);
        }
      }
    }
  }, [yearJoined, monthJoined, yearLefted, monthLefted, isInService, yearLeftedField, monthLeftedField, setValue, clearErrors]);

  useEffect(() => {
    if (isInService) {
      setValue(yearLeftedField, "", { shouldValidate: false });
      setValue(monthLeftedField, "", { shouldValidate: false });
      setValue(inServiceField, "true", { shouldValidate: false });
      clearErrors(yearLeftedField);
      clearErrors(monthLeftedField);

      setTimeout(() => {
        trigger([yearLeftedField, monthLeftedField], { shouldFocus: false });
      }, 0);
    } else {
      setValue(inServiceField, "", { shouldValidate: false });
    }
  }, [isInService, yearLeftedField, monthLeftedField, inServiceField, setValue, clearErrors, trigger]);

  return (
    <div
      className={cn(
        "md:border-cream flex flex-col gap-4 md:gap-6",
        isEdit ? isBorderTop && "border-t pt-6 md:pt-12" : "border-t p-0 py-6 md:rounded-md md:border md:p-4 lg:p-6 xl:p-12",
      )}
    >
      <p className={`heading-4 text-cream ${isEdit ? "hidden md:block" : ""}`}>
        {t("form.workHistory.itemTitle")}
        {displayIndex}
      </p>
      {isEdit && (
        <p className={`heading-3-30 text-cream ${isEdit ? "md:hidden" : ""}`}>
          {t("form.workHistory.itemTitle")}
          {displayIndex}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col gap-2 lg:flex-row">
          <div className={`w-[70px] ${isEdit ? "flex xl:invisible xl:block" : ""}`}>
            <FormLabel className="mt-0 md:mt-3.5">{t("form.workHistory.period.label")}</FormLabel>
          </div>
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:gap-4">
            <div className="flex flex-1 gap-2 md:gap-4">
              <FormControl
                type="select"
                name={yearJoinedField}
                label={t("form.workHistory.period.yearJoined.label")}
                placeholder={t("form.workHistory.period.yearJoined.placeholder")}
                options={joinedDatePicker.yearOptions}
                className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                isColumn
                isShowLabel={false}
              />
              <FormControl
                type="select"
                name={monthJoinedField}
                label={t("form.workHistory.period.monthJoined.label")}
                placeholder={t("form.workHistory.period.monthJoined.placeholder")}
                options={joinedDatePicker.monthOptions}
                className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                isColumn
                isShowLabel={false}
              />
            </div>
            <div className="text-cream pointer-events-auto font-light md:mt-4">～</div>
            <div className="flex flex-1 gap-2 md:gap-4">
              <FormControl
                type="select"
                name={yearLeftedField}
                label={t("form.workHistory.period.yearLefted.label")}
                placeholder={t("form.workHistory.period.yearLefted.placeholder")}
                options={filteredYearLeftedOptions}
                className={cn("pointer-events-auto flex-1 gap-2 rounded-md md:gap-4")}
                isColumn
                isShowLabel={false}
              />
              <FormControl
                type="select"
                name={monthLeftedField}
                label={t("form.workHistory.period.monthLefted.label")}
                placeholder={t("form.workHistory.period.monthLefted.placeholder")}
                options={filteredMonthLeftedOptions}
                className={cn("pointer-events-auto flex-1 gap-2 rounded-md md:gap-4")}
                isColumn
                isShowLabel={false}
              />
            </div>
            <div className="flex md:mt-4">
              <Checkbox
                className="mt-[5px]"
                id={`in-service-checkbox-${index}`}
                label={t("form.workHistory.period.inService")}
                checked={isInService}
                onCheckedChange={(checked) => setIsInService(checked === true)}
              />
              <label htmlFor={`in-service-checkbox-${index}`} className="text-cream text-1 cursor-pointe ml-1 block cursor-pointer">
                {t("form.workHistory.period.inService")}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-row gap-2">
        <div>
          <FormLabel className="mt-2 w-[70px]">{t("form.workHistory.companyName.label")}</FormLabel>
        </div>
        <FormControl
          name={companyNameField}
          label={t("form.workHistory.companyName.label")}
          placeholder={t("form.workHistory.companyName.placeholder")}
          className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
          isShowLabel={false}
          maxLength={255}
        />
      </div>
      <div className="flex flex-1 flex-row gap-2">
        <div>
          <FormLabel className="mt-2 w-[70px]">{t("form.workHistory.position.label")}</FormLabel>
        </div>
        <FormControl
          name={positionField}
          label={t("form.workHistory.position.label")}
          placeholder={t("form.workHistory.position.placeholder")}
          className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
          isShowLabel={false}
          maxLength={255}
        />
      </div>
      {index > 1 && (
        <button
          type="button"
          onClick={() => removeWorkHistory(index)}
          className="text-cream absolute top-4 right-4 cursor-pointer text-[16px] underline hover:opacity-70"
        >
          {t("form.workHistory.delete")}
        </button>
      )}
    </div>
  );
};

export default WorkHistoryItem;
