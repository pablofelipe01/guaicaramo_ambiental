import Airtable, { FieldSet } from 'airtable';

// Configuración de Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);

// Tablas
export const usuariosTable = base(process.env.AIRTABLE_USUARIOS_TABLE!);
export const centralizacionTable = base(process.env.AIRTABLE_CENTRALIZACION_TABLE!);
export const datosAmbientalesTable = base(process.env.AIRTABLE_DATOS_AMBIENTALES_TABLE!);
export const datosContabilidadTable = base(process.env.AIRTABLE_DATOS_CONTABILIDAD_TABLE!);

// Tipos
export interface Usuario {
  id: string;
  ID: number;
  correoElectronico: string;
  contrasenaHash: string;
  nombreCompleto: string;
  ultimoInicioSesion?: string;
  notas?: string;
  intentosFallidos?: number;
  bloqueadoHasta?: string;
  fotoPerfil?: Array<{
    id: string;
    url: string;
    filename: string;
  }>;
}

export interface CentralizacionInfo {
  id: string;
  nombreItem?: string;
  tipoItem?: 'Planta' | 'Contabilidad' | 'Ambiental';
  responsable?: string;
  fuenteDatos?: 'Archivo Excel' | 'Imagen' | 'Imágenes comprobantes';
  periodoRecepcion?: 'Mensual' | 'Trimestral';
  comentarios?: string;
  archivos?: Array<{
    id?: string;
    url: string;
    filename?: string;
  }>;
  datosAmbientales?: string[];
  datosContabilidad?: string[];
}

export interface DatosAmbientales {
  id: string;
  nombreReporte?: string;
  fuente?: 'Excel' | 'Imagen';
  archivoImagen?: Array<{
    id?: string;
    url: string;
    filename?: string;
  }>;
  centralizacionInfo?: string[];
}

export interface DatosContabilidad {
  id: string;
  mesPeriodo?: string;
  responsableContabilidad?: 'Faynsuri';
  tipoComprobante?: 'Recibos de energía';
  imagenesComprobantes?: Array<{
    id?: string;
    url: string;
    filename?: string;
  }>;
  periodo?: 'Mensual';
  centralizacionInfo?: string[];
}

// Funciones para Usuarios
export async function buscarUsuarioPorCorreo(correo: string): Promise<Usuario | null> {
  try {
    const records = await usuariosTable
      .select({
        filterByFormula: `{Correo electrónico} = '${correo}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      ID: record.get('ID') as number,
      correoElectronico: record.get('Correo electrónico') as string,
      contrasenaHash: record.get('Contraseña (hash)') as string,
      nombreCompleto: record.get('Nombre completo') as string,
      ultimoInicioSesion: record.get('Último inicio de sesión') as string | undefined,
      notas: record.get('Notas') as string | undefined,
      intentosFallidos: record.get('Intentos fallidos de login') as number | undefined,
      bloqueadoHasta: record.get('Bloqueado hasta') as string | undefined,
      fotoPerfil: record.get('Foto de perfil') as Usuario['fotoPerfil'],
    };
  } catch (error) {
    console.error('Error buscando usuario:', error);
    return null;
  }
}

export async function actualizarUltimoLogin(recordId: string): Promise<void> {
  try {
    await usuariosTable.update(recordId, {
      'Último inicio de sesión': new Date().toISOString(),
      'Intentos fallidos de login': 0,
    } as Partial<FieldSet>);
  } catch (error) {
    console.error('Error actualizando último login:', error);
  }
}

export async function incrementarIntentosFallidos(recordId: string, intentosActuales: number): Promise<void> {
  try {
    const nuevoIntentos = (intentosActuales || 0) + 1;
    const updates: Partial<FieldSet> = {
      'Intentos fallidos de login': nuevoIntentos,
    };

    // Bloquear por 30 minutos después de 5 intentos fallidos
    if (nuevoIntentos >= 5) {
      const bloqueadoHasta = new Date();
      bloqueadoHasta.setMinutes(bloqueadoHasta.getMinutes() + 30);
      updates['Bloqueado hasta'] = bloqueadoHasta.toISOString();
    }

    await usuariosTable.update(recordId, updates);
  } catch (error) {
    console.error('Error incrementando intentos fallidos:', error);
  }
}

export async function crearUsuario(data: {
  correo: string;
  contrasenaHash: string;
  nombreCompleto: string;
}): Promise<Usuario | null> {
  try {
    const record = await usuariosTable.create({
      'Correo electrónico': data.correo,
      'Contraseña (hash)': data.contrasenaHash,
      'Nombre completo': data.nombreCompleto,
    } as Partial<FieldSet>);

    return {
      id: record.id,
      ID: record.get('ID') as number,
      correoElectronico: data.correo,
      contrasenaHash: data.contrasenaHash,
      nombreCompleto: data.nombreCompleto,
    };
  } catch (error) {
    console.error('Error creando usuario:', error);
    return null;
  }
}

// Funciones para Datos Ambientales
export async function crearDatoAmbiental(data: {
  nombreReporte: string;
  fuente: 'Excel' | 'Imagen';
  archivoUrl: string;
  archivoNombre: string;
}): Promise<DatosAmbientales | null> {
  try {
    const record = await datosAmbientalesTable.create({
      'Nombre del Reporte': data.nombreReporte,
      'Fuente': data.fuente,
      'Archivo o Imagen': [{ url: data.archivoUrl, filename: data.archivoNombre }],
    } as unknown as Partial<FieldSet>);

    return {
      id: record.id,
      nombreReporte: data.nombreReporte,
      fuente: data.fuente,
    };
  } catch (error) {
    console.error('Error creando dato ambiental:', error);
    return null;
  }
}

// Funciones para Datos de Contabilidad
export async function crearDatoContabilidad(data: {
  mesPeriodo: string;
  tipoComprobante: 'Recibos de energía';
  imagenesUrls: Array<{ url: string; filename?: string }>;
}): Promise<DatosContabilidad | null> {
  try {
    const record = await datosContabilidadTable.create({
      'Mes/Periodo': data.mesPeriodo,
      'Responsable de Contabilidad': 'Faynsuri',
      'Tipo de Comprobante': data.tipoComprobante,
      'Imágenes Comprobantes': data.imagenesUrls,
      'Periodo': 'Mensual',
    } as unknown as Partial<FieldSet>);

    return {
      id: record.id,
      mesPeriodo: data.mesPeriodo,
      tipoComprobante: data.tipoComprobante,
    };
  } catch (error) {
    console.error('Error creando dato contabilidad:', error);
    return null;
  }
}

// Funciones para Centralización de Información
export async function crearCentralizacion(data: {
  nombreItem: string;
  tipoItem: 'Planta' | 'Contabilidad' | 'Ambiental';
  responsable?: string;
  fuenteDatos: 'Archivo Excel' | 'Imagen' | 'Imágenes comprobantes';
  periodoRecepcion: 'Mensual' | 'Trimestral';
  archivos?: Array<{ url: string; filename?: string }>;
  comentarios?: string;
}): Promise<CentralizacionInfo | null> {
  try {
    const fields: Partial<FieldSet> = {
      'Nombre del Item': data.nombreItem,
      'Tipo de Item': data.tipoItem,
      'Fuente de Datos': data.fuenteDatos,
      'Periodo de Recepción': data.periodoRecepcion,
    };

    if (data.responsable) {
      fields['Responsable'] = data.responsable;
    }

    if (data.archivos && data.archivos.length > 0) {
      // Airtable acepta attachments con url y filename opcional
      fields['Archivos/Imágenes'] = data.archivos as unknown as FieldSet[keyof FieldSet];
    }

    if (data.comentarios) {
      fields['Comentarios/Notas'] = data.comentarios;
    }

    const record = await centralizacionTable.create(fields);

    return {
      id: record.id,
      nombreItem: data.nombreItem,
      tipoItem: data.tipoItem,
      responsable: data.responsable,
      fuenteDatos: data.fuenteDatos,
      periodoRecepcion: data.periodoRecepcion,
    };
  } catch (error) {
    console.error('Error creando centralización:', error);
    return null;
  }
}

export async function listarCentralizacion(tipoItem?: 'Planta' | 'Contabilidad' | 'Ambiental'): Promise<CentralizacionInfo[]> {
  try {
    const options: {
      maxRecords: number;
      view: string;
      filterByFormula?: string;
    } = {
      maxRecords: 100,
      view: 'Grid view',
    };

    if (tipoItem) {
      options.filterByFormula = `{Tipo de Item} = '${tipoItem}'`;
    }

    const records = await centralizacionTable.select(options).firstPage();

    return records.map((record) => ({
      id: record.id,
      nombreItem: record.get('Nombre del Item') as string | undefined,
      tipoItem: record.get('Tipo de Item') as CentralizacionInfo['tipoItem'],
      responsable: record.get('Responsable') as string | undefined,
      fuenteDatos: record.get('Fuente de Datos') as CentralizacionInfo['fuenteDatos'],
      periodoRecepcion: record.get('Periodo de Recepción') as CentralizacionInfo['periodoRecepcion'],
      comentarios: record.get('Comentarios/Notas') as string | undefined,
      archivos: record.get('Archivos/Imágenes') as CentralizacionInfo['archivos'],
    }));
  } catch (error) {
    console.error('Error listando centralización:', error);
    return [];
  }
}

export default base;
