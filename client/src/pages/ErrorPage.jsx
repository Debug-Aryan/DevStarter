import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ErrorLayout from "../components/error/ErrorLayout";
import ErrorIllustration from "../components/error/ErrorIllustration";
import ErrorMessage from "../components/error/ErrorMessage";
import ErrorActions from "../components/error/ErrorActions";

import networkErrorSvg from "../assets/undraw_connection-lost_am29.svg";
import accessDeniedSvg from "../assets/undraw_access-denied_krem.svg";

import { buildGithubAuthorizeUrl } from "../services/githubPublish";

const ERROR_TYPES = ["network", "auth", "unknown"];

function normalizeErrorType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ERROR_TYPES.includes(normalized) ? normalized : "unknown";
}

export default function ErrorPage({ errorType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const effectiveErrorType = useMemo(() => {
    if (errorType) return normalizeErrorType(errorType);

    if (params?.type) return normalizeErrorType(params.type);

    const fromState = location.state?.errorType;
    if (fromState) return normalizeErrorType(fromState);

    const search = new URLSearchParams(location.search);
    const fromQuery = search.get("type");
    if (fromQuery) return normalizeErrorType(fromQuery);

    return "unknown";
  }, [errorType, params?.type, location.search, location.state]);

  const config = useMemo(() => {
    switch (effectiveErrorType) {
      case "network":
        return {
          headline: "Looks like DevStarter lost connection 🚧",
          description: "Our servers are taking a short break. Try again in a moment.",
          illustrationSrc: networkErrorSvg,
          illustrationAlt: "Network error illustration",
          showLoginAgain: false,
        };
      case "auth":
        return {
          headline: "You don’t have access to this page",
          description: "First generate the Project.",
          illustrationSrc: accessDeniedSvg,
          illustrationAlt: "Access denied illustration",
          showLoginAgain: true,
        };
      default:
        return {
          headline: "Something went wrong",
          description: "We hit an unexpected issue. Please retry, or head back home.",
          illustrationSrc: networkErrorSvg,
          illustrationAlt: "Unexpected error illustration",
          showLoginAgain: false,
        };
    }
  }, [effectiveErrorType]);

  const onRetry = () => {
    window.location.reload();
  };

  const onGoHome = () => {
    navigate("/");
  };

  const onLoginAgain = () => {
    const url = buildGithubAuthorizeUrl();
    window.location.assign(url);
  };

  return (
    <ErrorLayout>
      <div className="w-full max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <ErrorMessage headline={config.headline} description={config.description} />
            <ErrorActions
              onRetry={onRetry}
              onGoHome={onGoHome}
              onLoginAgain={onLoginAgain}
              showLoginAgain={config.showLoginAgain}
            />
          </div>

          <div className="order-1 md:order-2">
            <ErrorIllustration src={config.illustrationSrc} alt={config.illustrationAlt} />
          </div>
        </div>
      </div>
    </ErrorLayout>
  );
}
