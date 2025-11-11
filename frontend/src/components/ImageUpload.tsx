import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  characterId?: number;
  currentImagePath?: string | null;
  onImageChange?: (imagePath: string | null) => void;
}

export function ImageUpload({ characterId, currentImagePath, onImageChange }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentImagePath ? `http://localhost:8000${currentImagePath}` : null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar preview com currentImagePath
  useEffect(() => {
    if (currentImagePath) {
      setImagePreview(`http://localhost:8000${currentImagePath}`);
    } else {
      setImagePreview(null);
    }
  }, [currentImagePath]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se o personagem foi salvo
    if (!characterId) {
      toast.error("Salve o personagem antes de adicionar uma imagem");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo: 5MB");
      return;
    }

    // Preview local imediato
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:8000/personagens/${characterId}/upload-imagem`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erro ao enviar imagem");
      }

      const data = await response.json();
      const imagePath = data.imagemPath;
      
      setImagePreview(`http://localhost:8000${imagePath}`);
      onImageChange?.(imagePath);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar imagem");
      setImagePreview(currentImagePath ? `http://localhost:8000${currentImagePath}` : null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!characterId) {
      // Se não tem ID ainda (criação), só limpa preview
      setImagePreview(null);
      onImageChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Se não tem preview de imagem, não há nada para deletar
    if (!imagePreview && !currentImagePath) {
      toast.info("Não há imagem para deletar");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/personagens/${characterId}/imagem`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Se for 404 (personagem sem imagem), apenas limpar localmente
        if (response.status === 404) {
          setImagePreview(null);
          onImageChange?.(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          toast.info("Imagem removida");
          return;
        }
        throw new Error(errorData.detail || "Erro ao deletar imagem");
      }

      setImagePreview(null);
      onImageChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Imagem deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar imagem");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Aviso se não tem ID */}
      {!characterId && (
        <div className="w-full p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center font-medium">
            💾 Salve o personagem primeiro para poder adicionar uma imagem
          </p>
        </div>
      )}
      
      {/* Preview da Imagem */}
      <div className="relative w-48 h-48 rounded-xl border-2 border-dashed border-border overflow-hidden bg-secondary/20">
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleDelete}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <User className="h-16 w-16 mb-2" />
            <p className="text-xs text-center px-4">Sem imagem</p>
          </div>
        )}
      </div>

      {/* Botão de Upload */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !characterId}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Enviando..." : imagePreview ? "Trocar Imagem" : "Adicionar Imagem"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG, GIF ou WebP • Máx 5MB
      </p>
    </div>
  );
}
