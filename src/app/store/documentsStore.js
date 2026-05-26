import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useDocumentsStore = create(
  devtools(
    (set) => ({
      uploadedDocs:       {},
      uploadProgress:     {},
      verificationStatus: 'pending',

      addDocument: (docId, file) =>
        set((s) => ({
          uploadedDocs: { ...s.uploadedDocs, [docId]: file },
        })),

      removeDocument: (docId) =>
        set((s) => {
          const { [docId]: _removed, ...rest } = s.uploadedDocs;
          return { uploadedDocs: rest };
        }),

      setUploadProgress: (docId, progress) =>
        set((s) => ({
          uploadProgress: { ...s.uploadProgress, [docId]: progress },
        })),

      setVerificationStatus: (status) =>
        set({ verificationStatus: status }),

      update: (fields) => set((s) => ({ ...s, ...fields })),
      reset: () =>
        set({ uploadedDocs: {}, uploadProgress: {}, verificationStatus: 'pending' }),
    }),
    { name: 'DocumentsStore' }
  )
);
