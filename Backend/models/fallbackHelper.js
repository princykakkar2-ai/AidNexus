import mongoose from "mongoose";

/**
 * Creates a promise-like object that mimics a Mongoose Query chain.
 * This ensures that methods like .sort(), .select(), and .populate()
 * can be safely called on the query result when MongoDB is offline.
 *
 * @param {any|Promise<any>} promiseOrData The raw array or data, or a promise resolving to it.
 * @returns {Object} A Mongoose-compatible query chain.
 */
export function makeQueryChain(promiseOrData) {
  const promise = Promise.resolve(promiseOrData);

  const chain = {
    sort: function (sortObj) {
      const sortedPromise = promise.then((data) => {
        if (Array.isArray(data)) {
          const key = Object.keys(sortObj)[0];
          const order = sortObj[key] === -1 || sortObj[key] === "desc" ? -1 : 1;
          return [...data].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (valA instanceof Date && valB instanceof Date) {
              return (valA - valB) * order;
            }
            if (valA < valB) return -1 * order;
            if (valA > valB) return 1 * order;
            return 0;
          });
        }
        return data;
      });
      return makeQueryChain(sortedPromise);
    },

    select: function () {
      return this;
    },

    populate: function () {
      return this;
    },

    exec: function () {
      return promise;
    },

    then: function (onFulfilled, onRejected) {
      return promise.then(onFulfilled, onRejected);
    },

    catch: function (onRejected) {
      return promise.catch(onRejected);
    }
  };

  return chain;
}

/**
 * Helper to generate a random hex string ID.
 * @param {string} prefix 
 * @returns {string}
 */
export function generateId(prefix = "") {
  return (
    prefix +
    Math.random().toString(16).substring(2, 10) +
    Math.random().toString(16).substring(2, 10)
  );
}

/**
 * Wraps a plain JS object representing a database document to support the Mongoose save() method.
 *
 * @param {Object} doc The plain JS object representing the document.
 * @param {Array} arrayToUpdate The in-memory array acting as the collection.
 * @returns {Object|null} The wrapped document.
 */
export function wrapDocument(doc, arrayToUpdate) {
  if (!doc) return null;
  return {
    ...doc,
    save: async function () {
      const idx = arrayToUpdate.findIndex(item => item._id === doc._id);
      if (idx !== -1) {
        // Merge changed properties from 'this' (which might have been edited)
        const { save, ...restThis } = this;
        const updatedDoc = { 
          ...arrayToUpdate[idx], 
          ...restThis, 
          updatedAt: new Date() 
        };
        arrayToUpdate[idx] = updatedDoc;
        console.log("[Fallback DB] Saved document:", updatedDoc);
      }
      return this;
    }
  };
}

