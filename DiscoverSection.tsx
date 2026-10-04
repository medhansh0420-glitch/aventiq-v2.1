'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Bookmark } from 'lucide-react';
import { OPPORTUNITIES } from '@/data/opportunities';
import { useSavedOpportunities } from '@/hooks/useSavedOpportunities';

const CATEGORIES = [
  'Scholarship',
  'Competition',
  'Research',
  'Internship',
  'Entrepreneurship',
  'Hackathon',
  'Volunteering',
  'Fellowship',
];

const LOCATIONS = [
  'Global',
  'Remote',
  'USA',
  'UK',
  'Europe',
  'Asia',
  'Africa',
  'India',
  'Canada',
  'Australia',
];

const EDUCATION_LEVELS = [
  'High School',
  'Undergraduate',
  'Graduate',
  'Postgraduate',
];

const todayISO = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
};

const isActiveOpportunity = (deadline: string, status: string) => {
  if (status.toLowerCase() === 'closed') return false;

  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return deadline >= todayISO();
  }

  return true;
};

const daysUntil = (deadline: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return 9999;

  const today = new Date(`${todayISO()}T00:00:00`);
  const end = new Date(`${deadline}T00:00:00`);

  return Math.max(
    0,
    Math.ceil((end.getTime() - today.getTime()) / 86400000)
  );
};

export default function DiscoverSection() {
  const { toggleSave, isSaved } = useSavedOpportunities();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [days, setDays] = useState(9999);
  const [education, setEducation] = useState('All');
  const [freeOnly, setFreeOnly] = useState(false);
  const [show, setShow] = useState(false);

  const filtered = useMemo(() => {
    return OPPORTUNITIES
      .filter((o) => isActiveOpportunity(o.deadline, o.status))
      .filter((o) => {
        const q = query.trim().toLowerCase();
        const remaining = daysUntil(o.deadline);

        const searchableText = [
          o.title,
          o.organization,
          o.description,
          o.category,
          o.location,
          o.targetAudience,
          o.educationLevel,
        ]
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          !q || searchableText.includes(q);

        const matchesCategory =
          category === 'All' || o.category === category;

        const matchesLocation =
          location === 'All' ||
          o.location.toLowerCase().includes(location.toLowerCase());

        const matchesDeadline =
          remaining <= days;

        const matchesEducation =
          education === 'All' ||
          o.educationLevel
            .toLowerCase()
            .includes(education.toLowerCase());

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLocation &&
          matchesDeadline &&
          matchesEducation
        );
      })
      .filter((o) => {
        /*
         * The new Opportunity interface does not contain
         * a price/cost/free field.
         *
         * Therefore "Free only" cannot be reliably applied
         * without inventing data.
         *
         * Until the interface contains such a field, this
         * filter leaves all opportunities visible.
         */
        if (!freeOnly) return true;
        return true;
      })
      .sort(
        (a, b) =>
          daysUntil(a.deadline) -
          daysUntil(b.deadline)
      );
  }, [
    query,
    category,
    location,
    days,
    education,
    freeOnly,
  ]);

  const clear = () => {
    setQuery('');
    setCategory('All');
    setLocation('All');
    setDays(9999);
    setEducation('All');
    setFreeOnly(false);
  };

  return (
    <section
      id="discover"
      className="section container"
    >
      <div className="section-head">
        <div>
          <div className="section-kicker">
            Discover
          </div>

          <h2>
            Opportunities with a reason to care.
          </h2>
        </div>

        <p>
          Search the current AventIQ collection.
          Always verify details on the official
          source before applying.
        </p>
      </div>

      <div className="toolbar">
        <div className="searchrow">
          <div className="searchbox">
            <Search
              className="searchicon"
              size={17}
            />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search by opportunity, organization, skill..."
            />
          </div>

          <button
            className="filterbtn"
            onClick={() => setShow(!show)}
            type="button"
          >
            <SlidersHorizontal
              size={15}
              style={{
                verticalAlign: '-2px',
                marginRight: 7,
              }}
            />

            Filters
          </button>

          <button
            className="filterbtn"
            onClick={clear}
            type="button"
          >
            Reset
          </button>
        </div>

        {show && (
          <div className="filters">
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="All">
                All categories
              </option>

              {CATEGORIES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            >
              <option value="All">
                All locations
              </option>

              {LOCATIONS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={days}
              onChange={(e) =>
                setDays(Number(e.target.value))
              }
            >
              <option value="14">
                Next 14 days
              </option>

              <option value="30">
                Next 30 days
              </option>

              <option value="60">
                Next 60 days
              </option>

              <option value="9999">
                Any time
              </option>
            </select>

            <select
              value={education}
              onChange={(e) =>
                setEducation(e.target.value)
              }
            >
              <option value="All">
                All education
              </option>

              {EDUCATION_LEVELS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 10,
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          <input
            id="free"
            type="checkbox"
            checked={freeOnly}
            onChange={(e) =>
              setFreeOnly(e.target.checked)
            }
          />

          <label htmlFor="free">
            Free only
          </label>

          <span
            style={{
              marginLeft: 'auto',
            }}
          >
            {filtered.length} active opportunities
          </span>
        </div>
      </div>

      <div className="cards">
        {filtered.map((o) => (
          <article
            className="opp-card"
            key={o.id}
          >
            <div className="cardtop">
              <div>
                <div className="meta">
                  {o.category} · {o.location}
                </div>

                <h3>{o.title}</h3>

                <div className="org">
                  {o.organization}
                </div>
              </div>

              <button
                className={
                  'save ' +
                  (isSaved(o.id)
                    ? 'active'
                    : '')
                }
                onClick={() =>
                  toggleSave(o.id)
                }
                aria-label="Save opportunity"
                type="button"
              >
                <Bookmark
                  size={18}
                  fill={
                    isSaved(o.id)
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>
            </div>

            <p className="desc">
              {o.description}
            </p>

            <div className="tags">
              <span className="tag">
                {o.category}
              </span>

              {o.educationLevel && (
                <span className="tag">
                  {o.educationLevel}
                </span>
              )}

              {o.verificationStatus && (
                <span className="tag">
                  {o.verificationStatus}
                </span>
              )}
            </div>

            <div className="bottom">
              <span className="deadline">
                {daysUntil(o.deadline) <= 7
                  ? 'Closing soon · '
                  : ''}

                {o.deadline}
              </span>

              {o.status.toLowerCase() !==
              'closed' ? (
                <a
                  className="apply"
                  href={o.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View & apply ↗
                </a>
              ) : (
                <span className="meta">
                  Closed
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="empty">
          No active opportunities match those
          filters. Try resetting the search.
        </div>
      )}
    </section>
  );
}
