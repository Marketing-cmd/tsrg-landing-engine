const MAX_ITEMS = 50;

const state = {
  visits: [],
  leads: []
};

function pushLimited(list, item) {
  list.unshift(item);
  if (list.length > MAX_ITEMS) {
    list.length = MAX_ITEMS;
  }
}

function recordVisit(visit) {
  pushLimited(state.visits, visit);
}

function recordLead(lead) {
  pushLimited(state.leads, lead);
}

function snapshot() {
  return {
    visits: state.visits.slice(),
    leads: state.leads.slice(),
    counts: {
      visits: state.visits.length,
      leads: state.leads.length
    }
  };
}

module.exports = {
  recordVisit,
  recordLead,
  snapshot
};
