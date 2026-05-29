export const MAX_TASK_IMAGE_BYTES = 5 * 1024 * 1024;

interface TaskImageCandidate {
  type: string;
  size: number;
}

export const validateTaskImageFile = (file: TaskImageCandidate): string | undefined => {
  if (!file.type.startsWith('image/')) {
    return '이미지 파일만 업로드할 수 있습니다.';
  }

  if (file.size > MAX_TASK_IMAGE_BYTES) {
    return '업무 사진은 5MB 이하로 등록해 주세요.';
  }

  return undefined;
};

export const readTaskImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다. 다시 선택해 주세요.'));
    reader.readAsDataURL(file);
  });
