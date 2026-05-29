export const MAX_FACILITY_IMAGE_BYTES = 2 * 1024 * 1024;

interface FacilityImageCandidate {
  type: string;
  size: number;
}

export const validateFacilityImageFile = (file: FacilityImageCandidate): string | undefined => {
  if (!file.type.startsWith('image/')) {
    return '이미지 파일만 업로드할 수 있습니다.';
  }

  if (file.size > MAX_FACILITY_IMAGE_BYTES) {
    return '시설 이미지는 2MB 이하로 등록해 주세요.';
  }

  return undefined;
};

export const readFacilityImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다. 다시 선택해 주세요.'));
    reader.readAsDataURL(file);
  });
