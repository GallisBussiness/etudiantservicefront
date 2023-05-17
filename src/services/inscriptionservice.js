import Api from "./Api";

export const createInscription = (data) => Api.post('/inscription', data).then(res => res.data);
export const getInscriptions = () => Api.get('/inscription').then(res => res.data);
export const getInscriptionsBySession = (id) => Api.get('/inscription/bysession/' + id).then(res => res.data);
export const getInscriptionsByEtudiant = (id) => Api.get('/inscription/byetudiant/' + id).then(res => res.data);
export const getInscription = (id) => Api.get('/inscription/' + id).then(res => res.data);
export const updateInscription = (id,data) => Api.patch('/inscription/' + id, data).then(res => res.data);
export const removeInscription = (id) => Api.delete('/inscription/'+id).then(res => res.data);