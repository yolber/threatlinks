class Filter extends Array {
  constructor(...content) {
    if (content.length === 1) {
      if (Array.isArray(content[0])) {
        content = content[0];
      } else if (!content[0]) {
        content = 0;
      }
    }
    super(...content);
  }

  // Since there is no es6 implementation which supports extendable builtins, return values have to be wrapped again

  reduceTo(...values) {
    const _reduced = this.reduce((total, element) => {
      if (element) {
        if (values.length > 1) {
          const obj = {};
          for (const key of values) {
            obj[key] = element[key];
          }
          return [...total, obj];
        }
        return [...total, element[values[0]]];
      } else {
        return total;
      }
    }, []);

    if (_reduced.length === 1 && _reduced[0] > 0xffffff) {
      const _filter = new Filter();
      _filter.push(_reduced[0]);
      return _filter;
    }

    return new Filter(_reduced);
  }

  _filter({
    cond = {},
    type = false
  } = {
    cond: {},
    type: false
  }, fn) {
    return this.filter(element => {
      let ignore = type;
      for (const k in cond) {
        if (cond.hasOwnProperty(k)) {
          ignore = element[k] !== cond[k];
        }
      }
      if (ignore) {
        return !type;
      } else {
        return fn(element);
      }
    });
  }

  filterExact(key, value, cond) {
    if (!Array.isArray(key)) {
      key = [key];
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
    const _filtered = this._filter(cond, element => {
      let inFilter = true;
      key.forEach((k, id) => {
        if (element[k] !== value[id]) {
          inFilter = false;
        }
      });
      return inFilter;
    });

    return new Filter(_filtered);
  }

  filterIn(key, values, cond) {
    if (values.length === 0) {
      return this;
    }
    const _filtered = this._filter(cond, element => {
      return values.indexOf(element[key]) !== -1;
    });

    return new Filter(_filtered);
  }

  filterRelative(key, {
    gt = -Infinity,
    lt = Infinity
  }, cond) {
    const _filtered = this._filter(cond, element => {
      return element[key] < lt && element[key] > gt;
    });

    return new Filter(_filtered);
  }

  toggle(element) {
    const index = this.indexOf(element);
    if (index === -1) {
      this.push(element);
    } else {
      this.splice(index, 1);
    }
  }

  unique(withCount = false) {
    if (withCount) {
      const counts = {};
      this.forEach(val => {
        counts[val] = counts[val] ? counts[val] + 1 : 1;
      });
      return counts;
    } else {
      return new Filter(...new Set(this));
    }
  }

  _deepCheckObjects(object1, object2) {
    for (const p in object1) {
      if (object1.hasOwnProperty(p)) {
        if (object1[p] !== object2[p]) {
          return false;
        }
      }
    }
    for (const p in object2) {
      if (object2.hasOwnProperty(p)) {
        if (object1[p] !== object2[p]) {
          return false;
        }
      }
    }
    return true;
  }
  contains(element) {
    if (typeof element === 'object' && this.length !== 0) {
      let _contains = false;
      this.forEach(object => {
        if (object && this._deepCheckObjects(element, object)) {
          _contains = true;
        }
      });
      return _contains;
    } else if (this.indexOf(element) === -1) {
      return false;
    }
    return true;
  }
  dynamicSort(property) {
    this.sort((a, b) => {
      let sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      const result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
      return result * sortOrder;
    });
    return this;
  }
  groupBy(key, object) {
    const result = object ? {} : [];
    const links = {};
    this.forEach(e => {
      if (!links[e[key]]) {
        links[e[key]] = [];
      }
      links[e[key]].push(e);
    });
    for (const k in links) {
      if (links.hasOwnProperty(k)) {
        if (object) {
          result[k] = links[k];
        } else {
          result.push({
            key: k,
            elements: links[k]
          });
        }
      }
    }
    return result;
  }
}

export default Filter;
