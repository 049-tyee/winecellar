'use client';

/**
 * 编辑级模块标题：编号 eyebrow + 超大中文标题 + 英文副题
 * 参考高端单页排版（Step 01 / 录音 Recording 形式）
 */
export default function SectionHeading({
  index,
  title,
  en,
  desc,
  align = 'left',
}: {
  index?: string;
  title: string;
  en?: string;
  desc?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`space-y-4 ${align === 'center' ? 'text-center' : ''}`}>
      {index && <p className="eyebrow animate-rise">{index}</p>}
      <h2 className="display-xl text-white animate-rise delay-100">
        {title}
        {en && (
          <span className="block mt-3 text-lg md:text-xl font-light tracking-[0.3em] text-[#B8860B]">
            {en}
          </span>
        )}
      </h2>
      {desc && (
        <p className={`text-neutral-400 max-w-xl leading-relaxed animate-rise delay-200 ${align === 'center' ? 'mx-auto' : ''}`}>
          {desc}
        </p>
      )}
    </div>
  );
}
