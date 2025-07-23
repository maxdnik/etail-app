import mongoose from 'mongoose';

const EtaIlApplicationSchema = new mongoose.Schema({
  // Info de viaje
  travel: {
    purpose: String,
    arrival: String,
    stay: String,
  },
  // Pasaporte
  passport: {
    docType: String,
    number: String,
    country: String,
    code: String,
    nationality: String,
    biometric: String,
    surname: String,
    name: String,
    issueDate: String,
    expiryDate: String,
    birthDate: String,
    birthCountry: String,
    gender: String,
  },
  // Datos personales
  personal: {
    nationality2: String,
    marital: String,
    fatherName: String,
    fatherSurname: String,
    motherName: String,
    motherSurname: String,
    mobile: String,
    homeCountry: String,
    city: String,
    occupation: String,
    org: String,
    role: String,
    workPhone: String,
    workEmail: String,
    historyVisited: String,
    historyVisa: String,
  },
  // Declaración jurada
  declaration: {
    confirmed: Boolean
  },
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.EtaIlApplication || mongoose.model('EtaIlApplication', EtaIlApplicationSchema);
