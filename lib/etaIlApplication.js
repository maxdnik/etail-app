import mongoose from 'mongoose';

const EtaIlApplicationSchema = new mongoose.Schema({
  applicantType: { 
    type: String, 
    enum: ['self', 'representative'], 
    default: 'self' 
  },
  
  contactEmail: String,

  representative: {
    surname: String,
    name: String,
    docNumber: String,
    country: String,
    phone: String,
  },

  travel: {
    purpose: String,
    arrival: String,
    stay: String,
  },
  
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
    passportNumber: String,
    givenName: String,
    countryCode: String
  },

  personal: {
    nacionalidadAdicional: String,
    numeroIdIsrael: String,
    estadoCivil: String,
    padreNombre: String,
    padreApellido: String,
    madreNombre: String,
    madreApellido: String,
    telefonoMovil: String,
    telefonoAdicional: String,
    domicilioPais: String,
    domicilioCiudad: String,
    ocupacion: String,
    orgNombre: String,
    puesto: String,
    telefonoTrabajo: String,
    emailTrabajo: String,
  },

  migratory: {
    visitedIsrael: String,
    recentVisitYear: String,
    appliedVisa: String,
    visaDetails: String,
  },

  declaration: {
    confirmed: Boolean,
    truthful: Boolean,
    terms: Boolean
  },

  fc: { type: String, default: "No" },
  
  // ✅ CORREGIDO: Un solo campo status con default PENDIENTE
  status: { type: String, default: 'PENDIENTE' },
  
  paymentId: String, // Agregado para guardar el ID de Mercado Pago
  paymentDate: Date

}, {
  timestamps: true, 
  strict: false 
});

export default mongoose.models.EtaIlApplication || mongoose.model('EtaIlApplication', EtaIlApplicationSchema);