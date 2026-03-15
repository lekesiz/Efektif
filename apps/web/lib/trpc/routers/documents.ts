import { z } from "zod";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@efektif/shared";
import { router, protectedProcedure } from "./_app";

export const documentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    void ctx.user.id;
    return [] as { id: string; name: string; mimeType: string; size: number; uploadedAt: Date }[];
  }),

  getUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.enum(ALLOWED_MIME_TYPES),
        size: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input;
      return { uploadUrl: "", documentId: crypto.randomUUID() };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      void ctx.user.id;
      void input.id;
      return { success: true };
    }),
});
