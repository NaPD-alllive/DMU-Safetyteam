import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Save, Trash2, X } from 'lucide-react';
import { FACILITY_CATEGORIES, FACILITY_STATUSES } from '../../facility/facilityData';
import { readFacilityImageFile, validateFacilityImageFile } from '../../facility/facilityImage';
import { EMPTY_FACILITY_FORM, hasFacilityErrors, validateFacilityForm } from '../../facility/facilityValidation';
import { Facility, FacilityFormValues } from '../../facility/types';

interface FacilityFormPanelProps {
  editingFacility: Facility | null;
  onSubmit: (values: FacilityFormValues) => void;
  onCancelEdit: () => void;
}

const toFormValues = (facility: Facility | null): FacilityFormValues => {
  if (!facility) return EMPTY_FACILITY_FORM;
  return {
    name: facility.name,
    category: facility.category,
    capacity: String(facility.capacity),
    location: facility.location,
    description: facility.description,
    status: facility.status,
    imageUrl: facility.imageUrl,
  };
};

export default function FacilityFormPanel({
  editingFacility,
  onSubmit,
  onCancelEdit,
}: FacilityFormPanelProps) {
  const [values, setValues] = useState<FacilityFormValues>(() => toFormValues(editingFacility));
  const [errors, setErrors] = useState(validateFacilityForm(values));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const nextValues = toFormValues(editingFacility);
    setValues(nextValues);
    setErrors(validateFacilityForm(nextValues));
  }, [editingFacility]);

  const updateField = (name: keyof FacilityFormValues, value: string) => {
    const nextValue = name === 'capacity' ? value.replace(/[^\d,]/g, '') : value;
    const nextValues = { ...values, [name]: nextValue };
    setValues(nextValues);
    setErrors(validateFacilityForm(nextValues));
  };

  const selectImage = async (file: File | undefined) => {
    if (!file) return;

    const imageError = validateFacilityImageFile(file);
    if (imageError) {
      setErrors((current) => ({ ...current, imageUrl: imageError }));
      return;
    }

    try {
      const imageUrl = await readFacilityImageFile(file);
      updateField('imageUrl', imageUrl);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        imageUrl: error instanceof Error ? error.message : '이미지를 읽지 못했습니다.',
      }));
    }
  };

  const clearImage = () => {
    updateField('imageUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateFacilityForm(values);
    setErrors(nextErrors);
    if (hasFacilityErrors(nextErrors)) return;
    onSubmit(values);
    setValues(EMPTY_FACILITY_FORM);
  };

  return (
    <form onSubmit={submit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-black text-sm">{editingFacility ? '시설 수정' : '시설 등록'}</h3>
        {editingFacility && (
          <button type="button" onClick={onCancelEdit} className="p-1.5 rounded-lg text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <label className="block space-y-1.5">
        <span className="text-[10px] font-black text-slate-500 uppercase">시설명</span>
        <input value={values.name} onChange={(event) => updateField('name', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none" />
        {errors.name && <span className="text-[10px] text-rose-400 font-bold">{errors.name}</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <select value={values.category} onChange={(event) => updateField('category', event.target.value)} className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-black outline-none">
          {FACILITY_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={values.status} onChange={(event) => updateField('status', event.target.value)} className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-black outline-none">
          {FACILITY_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <label className="block space-y-1.5">
        <span className="text-[10px] font-black text-slate-500 uppercase">수용인원</span>
        <input value={values.capacity} onChange={(event) => updateField('capacity', event.target.value)} inputMode="numeric" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none" />
        {errors.capacity && <span className="text-[10px] text-rose-400 font-bold">{errors.capacity}</span>}
      </label>
      <label className="block space-y-1.5">
        <span className="text-[10px] font-black text-slate-500 uppercase">위치</span>
        <input value={values.location} onChange={(event) => updateField('location', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none" />
        {errors.location && <span className="text-[10px] text-rose-400 font-bold">{errors.location}</span>}
      </label>
      <label className="block space-y-1.5">
        <span className="text-[10px] font-black text-slate-500 uppercase">설명</span>
        <textarea value={values.description} onChange={(event) => updateField('description', event.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none" />
        {errors.description && <span className="text-[10px] text-rose-400 font-bold">{errors.description}</span>}
      </label>
      <div className="space-y-2">
        {values.imageUrl && (
          <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img src={values.imageUrl} alt="시설 이미지 미리보기" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 rounded-xl bg-rose-500 text-white shadow-lg"
              title="이미지 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        <label className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 text-xs text-slate-400 font-black cursor-pointer hover:border-indigo-500/50 hover:text-white">
          <ImagePlus className="w-4 h-4 text-indigo-400" />
          {values.imageUrl ? '이미지 다시 선택' : '이미지 업로드'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void selectImage(event.target.files?.[0])}
          />
        </label>
        {errors.imageUrl && <span className="text-[10px] text-rose-400 font-bold">{errors.imageUrl}</span>}
      </div>
      <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-2">
        <Save className="w-4 h-4" />
        {editingFacility ? '시설 수정 저장' : '시설 등록'}
      </button>
    </form>
  );
}
