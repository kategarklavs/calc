import React from 'react';
import { connect } from 'react-redux';

import DescriptionFilter from './description-filter';

import {
  MIN_EXPERIENCE,
  MAX_EXPERIENCE,
  EDU_LABELS,
  SITE_LABELS,
  BUSINESS_SIZE_LABELS,
  SCHEDULE_LABELS,
} from '../constants';

import { formatCommas } from '../util';

function stripTrailingComma(str) {
  // Removes trailing comma and whitespace from given string
  return str.replace(/,\s*$/, '');
}

export function Description({
  shownResults,
  totalResults,
  minExperience,
  maxExperience,
  education,
  site,
  businessSize,
  schedule,
  laborCategory,
}) {
  let results = ' results ';
  const filtersClasses = ['filters'];
  const filters = [];

  if (laborCategory) {
    filters.push(
      <DescriptionFilter key="lab">
        {stripTrailingComma(laborCategory)}
      </DescriptionFilter>,
    );
  }

  if (education.length) {
    filters.push(
      <DescriptionFilter
        key="edu" label="education level"
        extraClassName="education-filter"
      >
        {education.map(x => EDU_LABELS[x]).join(', ')}
      </DescriptionFilter>,
    );
  }

  if (minExperience !== MIN_EXPERIENCE ||
      maxExperience !== MAX_EXPERIENCE) {
    filters.push(
      <DescriptionFilter key="exp" label="experience">
        {minExperience} - {maxExperience} years
      </DescriptionFilter>,
    );
  }

  if (site) {
    filters.push(
      <DescriptionFilter key="sit" label="worksite">
        {SITE_LABELS[site]}
      </DescriptionFilter>,
    );
  }

  if (businessSize) {
    filters.push(
      <DescriptionFilter key="bus" label="business size">
        {BUSINESS_SIZE_LABELS[businessSize]}
      </DescriptionFilter>,
    );
  }

  if (schedule) {
    filters.push(
      <DescriptionFilter key="sch" label="schedule">
        {SCHEDULE_LABELS[schedule]}
      </DescriptionFilter>,
    );
  }

  if (filters.length) {
    results += 'with ';
  } else {
    filtersClasses.push('hidden');
  }

  // TODO: The original version of this faded-in (but never out)
  // whenever it changed. We might want to do that too, or choose
  // a different animation.

  return (
    <p className="">
      {`Showing ${formatCommas(shownResults)} of `}
      <span className="total">{formatCommas(totalResults)}</span>
      {results}
      <span className={filtersClasses.join(' ')}>
        {filters}
      </span>
    </p>
  );
}

Description.propTypes = {
  shownResults: React.PropTypes.number.isRequired,
  totalResults: React.PropTypes.number.isRequired,
  minExperience: React.PropTypes.number.isRequired,
  maxExperience: React.PropTypes.number.isRequired,
  education: React.PropTypes.array.isRequired,
  site: React.PropTypes.string.isRequired,
  businessSize: React.PropTypes.string.isRequired,
  schedule: React.PropTypes.string.isRequired,
  laborCategory: React.PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    shownResults: state.rates.data.results.length,
    totalResults: state.rates.data.count,
    minExperience: state.min_experience,
    maxExperience: state.max_experience,
    education: state.education,
    site: state.site,
    businessSize: state.business_size,
    schedule: state.schedule,
    laborCategory: state.q,
  };
}

export default connect(mapStateToProps)(Description);
