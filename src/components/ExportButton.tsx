import { Button } from "./ui/button";
import { Download, FileDown, FileText, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { ExportFormat, exportReport } from "@/services/exportService";
import { ReportData } from "@/services/reportService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ExportButtonProps {
  data: ReportData[];
  filters?: {
    tipoVehiculo?: string[];
    paisOrigen?: string[];
    puntoControl?: string[];
    resultadoInspeccion?: string[];
    nivelRiesgo?: string[];
  };
  dateRange?: { start: Date; end: Date };
  className?: string;
}

export function ExportButton({ 
  data, 
  filters, 
  dateRange, 
  className = '' 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    if (!data || data.length === 0) {
      toast.warning("No hay datos para exportar");
      return;
    }

    setIsExporting(true);
    
    try {
      await exportReport(data, {
        format,
        includeDetails: true,
        dateRange,
        filters
      });
      
      toast.success(`Exportación a ${format.toUpperCase()} completada`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error(`Error al exportar a ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isExporting || !data?.length}
          className={`gap-2 ${className}`}
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Exportar a PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('excel')}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Exportar a Excel (CSV)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
