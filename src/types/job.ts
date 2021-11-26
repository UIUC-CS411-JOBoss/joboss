export type JobItem = {
  id: number;
  title: string;
  company: string;
  location_countries: string;
  location_states: string;
  location_cities: string;
  text_description: string;
  apply_start: string;
  expiration_date: string;
  salary_type_name: string;
  remote: number;
  accepts_opt_cpt_candidates: number;
  willing_to_sponsor_candidate: number;
  work_auth_required: number;
};
