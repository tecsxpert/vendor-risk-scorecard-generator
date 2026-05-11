import PropTypes from "prop-types";

const SkeletonBlock = ({ className }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] ${className}`}
    />
  );
};

SkeletonBlock.propTypes = {
  className: PropTypes.string,
};

SkeletonBlock.defaultProps = {
  className: "",
};

const LoadingSkeleton = ({
  variant,
  rows,
}) => {
  if (variant === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="mt-5 h-10 w-20" />
              <SkeletonBlock className="mt-6 h-2 w-full" />
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="mt-3 h-72 w-full rounded-2xl" />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SkeletonBlock className="h-5 w-32" />

            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-3 h-2 w-full" />
                  <SkeletonBlock className="mt-2 h-2 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <SkeletonBlock className="h-5 w-48" />
        </div>

        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 px-6 py-5"
            >
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-4 w-16" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="mt-3 h-4 w-40" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="mt-5 h-3 w-full" />
              <SkeletonBlock className="mt-3 h-3 w-5/6" />
              <SkeletonBlock className="mt-3 h-3 w-4/6" />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SkeletonBlock className="h-5 w-28" />
              <SkeletonBlock className="mt-5 h-32 w-full" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SkeletonBlock className="h-5 w-24" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <SkeletonBlock
                  key={item}
                  className="h-12 w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonBlock
          key={index}
          className="h-16 w-full"
        />
      ))}
    </div>
  );
};

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf([
    "dashboard",
    "table",
    "detail",
    "default",
  ]),
  rows: PropTypes.number,
};

LoadingSkeleton.defaultProps = {
  variant: "default",
  rows: 5,
};

export default LoadingSkeleton;