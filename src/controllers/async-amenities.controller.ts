import { Request, Response } from "express";
import { amenitiesFromPrices } from "../schemas/amenitiesfromprices";
import { jobManager } from "../tools/jobManager";

 
export const startAsyncAmenitiesProcessing = async (req: Request, res: Response) => {
    try {
        console.log('🚀 Iniciando procesamiento asíncrono de amenities');

        const data = amenitiesFromPrices.parse(req.body);
        console.log('📋 Datos recibidos:', {
            location: data.location,
            priceMin: data.priceMin,
            priceMax: data.priceMax,
            sessionId: data.sessionId
        });

        // Crear job y retornar ID inmediatamente
        const jobId = await jobManager.createJob(data);

        console.log(`✅ Job creado: ${jobId}`);

        res.json({
            success: true,
            jobId: jobId,
            message: "Procesamiento iniciado. Use el jobId para consultar el estado.",
            statusUrl: `/api/amenities/status/${jobId}`,
            resultUrl: `/api/amenities/result/${jobId}`,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Error iniciando procesamiento asíncrono:', error.message);

        res.status(400).json({
            success: false,
            error: 'Error al iniciar el procesamiento',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Consultar estado del job
export const getJobStatus = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const job = jobManager.getJob(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job no encontrado',
                details: `El job ${jobId} no existe o ha sido eliminado`,
                timestamp: new Date().toISOString()
            });
        }

        const response: any = {
            success: true,
            jobId: job.id,
            status: job.status,
            progress: job.progress,
            startTime: job.startTime.toISOString(),
            timestamp: new Date().toISOString()
        };

        if (job.endTime) {
            response.endTime = job.endTime.toISOString();
            response.duration = (job.endTime.getTime() - job.startTime.getTime()) / 1000;
        }

        if (job.error) {
            response.error = job.error;
        }

        res.json(response);

    } catch (error: any) {
        console.error('❌ Error consultando estado del job:', error.message);

        res.status(500).json({
            success: false,
            error: 'Error al consultar el estado del job',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Obtener resultado del job
export const getJobResult = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const job = jobManager.getJob(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job no encontrado',
                details: `El job ${jobId} no existe o ha sido eliminado`,
                timestamp: new Date().toISOString()
            });
        }

        if (job.status === 'pending' || job.status === 'processing') {
            return res.status(202).json({
                success: false,
                error: 'Job en progreso',
                details: `El job ${jobId} aún está siendo procesado`,
                status: job.status,
                progress: job.progress,
                estimatedTime: 'El procesamiento puede tomar varios minutos',
                timestamp: new Date().toISOString()
            });
        }

        if (job.status === 'failed') {
            return res.status(500).json({
                success: false,
                error: 'Job falló',
                details: job.error,
                status: job.status,
                startTime: job.startTime.toISOString(),
                endTime: job.endTime?.toISOString(),
                timestamp: new Date().toISOString()
            });
        }

        // Job completado exitosamente
        const duration = job.endTime ? (job.endTime.getTime() - job.startTime.getTime()) / 1000 : 0;

        res.json({
            success: true,
            jobId: job.id,
            status: job.status,
            result: job.result,
            message: "Gracias por indicarnos tu rango de precios",
            executionTime: `${duration.toFixed(2)} segundos`,
            startTime: job.startTime.toISOString(),
            endTime: job.endTime?.toISOString(),
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Error obteniendo resultado del job:', error.message);

        res.status(500).json({
            success: false,
            error: 'Error al obtener el resultado del job',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Listar todos los jobs (para debugging)
export const listAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = jobManager.getAllJobs();

        res.json({
            success: true,
            jobs: jobs.map(job => ({
                id: job.id,
                status: job.status,
                progress: job.progress,
                startTime: job.startTime.toISOString(),
                endTime: job.endTime?.toISOString(),
                hasError: !!job.error
            })),
            totalJobs: jobs.length,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Error listando jobs:', error.message);

        res.status(500).json({
            success: false,
            error: 'Error al listar los jobs',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
