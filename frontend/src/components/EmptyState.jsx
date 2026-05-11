import PropTypes from "prop-types";

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_35%)]" />

      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5"
            />
          </svg>
        </div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>

            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

EmptyState.defaultProps = {
  title: "No Data Found",
  description:
    "There are currently no records available. Start by adding a new item to continue.",
  actionLabel: "",
  onAction: null,
};

export default EmptyState;