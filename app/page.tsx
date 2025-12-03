'use client';

import { useState } from 'react';
import SignatureCanvas from '@/components/SignatureCanvas';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [fileName, setFileName] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = (dataUrl: string) => {
    setSignatureData(dataUrl);
    setUploadStatus('idle');
  };

  const handleClear = () => {
    setSignatureData(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const uploadToSupabase = async () => {
    if (!signatureData || !fileName.trim()) {
      setErrorMessage('파일명을 입력해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(signatureData);
      const blob = await response.blob();

      const sanitizedFileName = fileName
        .trim()
        .replace(/[^a-zA-Z0-9가-힣\s-_]/g, '')
        .replace(/\s+/g, '_');

      const finalFileName = `${sanitizedFileName}_${Date.now()}.png`;

      const { error } = await supabase.storage
        .from('signatures')
        .upload(finalFileName, blob, {
          contentType: 'image/png',
          upsert: false,
        });

      if (error) throw error;

      setUploadStatus('success');
      setFileName('');
      setSignatureData(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-zinc-800">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">EM</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-50">전자서명</h1>
              <p className="text-[11px] text-zinc-500">이엠포커스</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 gap-4">
        {/* 서명 카드 */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-200">서명 입력</h2>
            <p className="text-xs text-zinc-500 mt-0.5">아래 영역에 서명을 그려주세요</p>
          </div>
          <div className="p-3">
            <SignatureCanvas onSave={handleSave} onClear={handleClear} />
          </div>
        </div>

        {/* 파일명 입력 카드 */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-200">파일 정보</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                파일명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="서명자 이름을 입력하세요"
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
                maxLength={50}
              />
              <p className="text-[11px] text-zinc-600">
                {fileName.length}/50자
              </p>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={uploadToSupabase}
              disabled={!signatureData || !fileName.trim() || isUploading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  저장 중...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  서명 저장
                </>
              )}
            </button>
          </div>
        </div>

        {/* 상태 메시지 */}
        {uploadStatus === 'success' && (
          <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/50 p-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-emerald-400">서명이 성공적으로 저장되었습니다.</p>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="rounded-lg border border-red-800/50 bg-red-950/50 p-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-4">
        <p className="text-center text-xs text-zinc-600">
          © 2024 이엠포커스. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
