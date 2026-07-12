import { run } from "uebersicht";

// ── 아래 URL을 본인의 GitHub Pages 주소로 바꿔주세요 ──────────────────
// 예: https://내깃허브아이디.github.io/benefit-alert/data.json
const DATA_URL = "https://YOUR_GITHUB_ID.github.io/benefit-alert/data.json";

export const command = `curl -s "${DATA_URL}?t=$(date +%s)"`;

// 1시간마다 새로고침 (원하면 숫자만 바꾸세요, 단위: ms)
export const refreshFrequency = 60 * 60 * 1000;

export const className = `
  top: 24px;
  right: 24px;
  width: 280px;
  font-family: -apple-system, "Apple SD Gothic Neo", sans-serif;
  z-index: 1;
`;

const card = {
  background: "rgba(20, 20, 20, 0.82)",
  borderRadius: "14px",
  padding: "14px 16px",
  color: "#fff",
  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
};

const openUrl = (url) => () => run(`open "${url}"`);

export const render = ({ output, error }) => {
  if (error) {
    return (
      <div style={card}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          정책 정보를 불러오지 못했어요
        </div>
      </div>
    );
  }
  if (!output) {
    return (
      <div style={card}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>불러오는 중…</div>
      </div>
    );
  }

  let data;
  try {
    data = JSON.parse(output);
  } catch (e) {
    return (
      <div style={card}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>데이터 형식 오류</div>
      </div>
    );
  }

  const newItems = (data.items || []).filter((it) => it.is_new).slice(0, 6);
  const hasNew = data.new_count > 0;

  return (
    <div style={card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600 }}>청년 정책 알림</div>
        <div
          style={{
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 10,
            background: hasNew ? "#ff5b52" : "rgba(255,255,255,0.15)",
          }}
        >
          {hasNew ? `새 소식 ${data.new_count}` : "새 소식 없음"}
        </div>
      </div>

      {newItems.length === 0 ? (
        <div style={{ fontSize: 12.5, opacity: 0.7 }}>
          오늘은 새로 뜬 정책이 없어요
        </div>
      ) : (
        newItems.map((it) => (
          <div
            key={it.id}
            onClick={openUrl(it.url)}
            style={{
              padding: "7px 0",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>{it.title}</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
              {it.category} · {it.org}
            </div>
          </div>
        ))
      )}

      <div style={{ fontSize: 10, opacity: 0.45, marginTop: 8 }}>
        {data.last_updated
          ? `업데이트: ${data.last_updated.slice(0, 16).replace("T", " ")}`
          : ""}
      </div>
    </div>
  );
};
