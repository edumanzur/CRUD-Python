import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dices, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import rpgBanner from "@/assets/rpg-banner.png";

// Tipos de dados disponíveis
const DICE_TYPES = [2, 4, 6, 8, 10, 12, 20, 100] as const;

interface DiceRoll {
  id: string;
  diceType: number;
  quantity: number;
  results: number[];
  total: number;
  timestamp: Date;
}

export default function DiceRoller() {
  const [selectedDiceType, setSelectedDiceType] = useState<number>(20);
  const [quantity, setQuantity] = useState<number>(1);
  const [modifier, setModifier] = useState<number>(0);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);

  // Função para rolar um dado
  const rollSingleDice = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1;
  };

  // Função para rolar múltiplos dados
  const handleRoll = () => {
    if (quantity < 1) {
      toast.error("A quantidade deve ser pelo menos 1!");
      return;
    }

    if (quantity > 100) {
      toast.error("Quantidade máxima é 100 dados!");
      return;
    }

    const results: number[] = [];
    for (let i = 0; i < quantity; i++) {
      results.push(rollSingleDice(selectedDiceType));
    }

    const sumResults = results.reduce((acc, val) => acc + val, 0);
    const total = sumResults + modifier;

    const newRoll: DiceRoll = {
      id: `roll-${Date.now()}`,
      diceType: selectedDiceType,
      quantity,
      results,
      total,
      timestamp: new Date(),
    };

    setRollHistory([newRoll, ...rollHistory]);
    toast.success(`Rolado: ${quantity}d${selectedDiceType} = ${total}`);
  };

  const clearHistory = () => {
    setRollHistory([]);
    toast.info("Histórico limpo!");
  };

  const getDiceEmoji = (type: number): string => {
    const emojiMap: Record<number, string> = {
      2: "🎲",
      4: "🎲",
      6: "🎲",
      8: "🎲",
      10: "🎲",
      12: "🎲",
      20: "🎯",
      100: "💯",
    };
    return emojiMap[type] || "🎲";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden border-b-4 border-double border-primary/40">
        <img
          src={rpgBanner}
          alt="Dice Roller Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center space-x-4">
            <Dices className="h-12 w-12 text-primary drop-shadow-lg" />
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary drop-shadow-lg">
                Dice Roller
              </h1>
              <p className="text-lg md:text-xl text-foreground/90 mt-2 font-body">
                Roll the dice for your RPG adventures
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dice Selector */}
          <div className="space-y-6">
            <Card className="rpg-card">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                Select Dice
              </h2>

              {/* Dice Type Selection */}
              <div className="space-y-4">
                <Label className="font-heading font-semibold">Dice Type</Label>
                <div className="grid grid-cols-4 gap-3">
                  {DICE_TYPES.map((dice) => (
                    <Button
                      key={dice}
                      variant={selectedDiceType === dice ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center space-y-1 ${
                        selectedDiceType === dice ? "rpg-button" : ""
                      }`}
                      onClick={() => setSelectedDiceType(dice)}
                    >
                      <span className="text-2xl">{getDiceEmoji(dice)}</span>
                      <span className="font-heading font-bold">d{dice}</span>
                    </Button>
                  ))}
                </div>

                {/* Quantity */}
                <div>
                  <Label className="font-heading font-semibold">Quantity</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                      className="flex-1 text-center font-heading text-xl font-bold h-12"
                      min="1"
                      max="100"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(100, quantity + 1))}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Modifier */}
                <div>
                  <Label className="font-heading font-semibold">Modifier (optional)</Label>
                  <Input
                    type="number"
                    value={modifier}
                    onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                    className="mt-2 font-heading text-lg font-bold h-12"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add or subtract from the total roll
                  </p>
                </div>

                {/* Roll Button */}
                <Button
                  onClick={handleRoll}
                  className="rpg-button w-full h-14 text-lg"
                  size="lg"
                >
                  <Dices className="h-5 w-5 mr-2" />
                  Roll {quantity}d{selectedDiceType}
                  {modifier !== 0 && ` ${modifier >= 0 ? '+' : ''}${modifier}`}
                </Button>

                {/* Quick Rolls */}
                <div className="pt-4 border-t border-border">
                  <Label className="font-heading font-semibold mb-2 block">Quick Rolls</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDiceType(20);
                        setQuantity(1);
                        setModifier(0);
                      }}
                      className="font-heading"
                    >
                      1d20
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDiceType(20);
                        setQuantity(2);
                        setModifier(0);
                      }}
                      className="font-heading"
                    >
                      2d20
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDiceType(6);
                        setQuantity(4);
                        setModifier(0);
                      }}
                      className="font-heading"
                    >
                      4d6
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Roll History */}
          <div className="space-y-6">
            <Card className="rpg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-heading font-bold text-primary">
                  Roll History
                </h2>
                {rollHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {rollHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Dices className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-body">
                    No rolls yet. Roll some dice to see history!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {rollHistory.map((roll) => (
                    <Card key={roll.id} className="rpg-card bg-accent/20 border-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getDiceEmoji(roll.diceType)}</span>
                            <span className="font-heading font-bold text-lg">
                              {roll.quantity}d{roll.diceType}
                            </span>
                          </div>
                          <Badge className="text-lg px-3 py-1 bg-primary">
                            Total: {roll.total}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {roll.results.map((result, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-base font-bold ${
                                result === roll.diceType
                                  ? "border-green-500 text-green-500 bg-green-500/10"
                                  : result === 1
                                  ? "border-red-500 text-red-500 bg-red-500/10"
                                  : ""
                              }`}
                            >
                              {result}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {roll.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
