import { NextRequest, NextResponse } from 'next/server';
import { crearCentralizacion } from '@/lib/airtable';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const area = formData.get('area') as string;
    const files = formData.getAll('files') as File[];
    const periodo = formData.get('periodo') as string;
    const comentarios = formData.get('comentarios') as string;

    if (!area || files.length === 0) {
      return NextResponse.json(
        { error: 'Área y archivos son requeridos' },
        { status: 400 }
      );
    }

    // Subir archivos a S3
    const fileUrls: Array<{ url: string; filename: string }> = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await uploadToS3(
        buffer,
        file.name,
        area,
        file.type
      );
      
      fileUrls.push({
        url: result.url,
        filename: result.filename,
      });
    }

    // Determinar tipo y configuración según el área
    let tipoItem: 'Planta' | 'Contabilidad' | 'Ambiental';
    let fuenteDatos: 'Archivo Excel' | 'Imagen' | 'Imágenes comprobantes';
    let periodoRecepcion: 'Mensual' | 'Trimestral';
    let responsable: string | undefined;

    switch (area) {
      case 'planta':
        tipoItem = 'Planta';
        fuenteDatos = 'Archivo Excel';
        periodoRecepcion = 'Trimestral';
        break;
      case 'contabilidad':
        tipoItem = 'Contabilidad';
        fuenteDatos = 'Imágenes comprobantes';
        periodoRecepcion = 'Mensual';
        responsable = 'Faynsuri';
        break;
      case 'aguas':
        tipoItem = 'Ambiental';
        fuenteDatos = 'Archivo Excel';
        periodoRecepcion = periodo === 'mensual' ? 'Mensual' : 'Trimestral';
        responsable = 'Diana';
        break;
      case 'ambiental-acopio':
        tipoItem = 'Ambiental';
        fuenteDatos = 'Imagen';
        periodoRecepcion = periodo === 'mensual' ? 'Mensual' : 'Trimestral';
        responsable = 'Karen';
        break;
      default:
        return NextResponse.json(
          { error: 'Área no válida' },
          { status: 400 }
        );
    }

    // Crear registro en Centralización de Información
    const nombreItem = `${area.charAt(0).toUpperCase() + area.slice(1)} - ${new Date().toLocaleDateString('es-CO')}`;
    
    const resultado = await crearCentralizacion({
      nombreItem,
      tipoItem,
      responsable,
      fuenteDatos,
      periodoRecepcion,
      archivos: fileUrls,
      comentarios: comentarios || `Subido el ${new Date().toLocaleString('es-CO')}`,
    });

    if (!resultado) {
      return NextResponse.json(
        { error: 'Error al guardar en Airtable' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Archivos subidos correctamente',
      recordId: resultado.id,
    });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
